"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  getListUserBookingsQueryKey,
  useCreateBooking,
  useGetBonusBalance,
} from "@/api";
import { Button } from "@/shared/components/ui/button";
import { useUser } from "@/contexts/user";
import {
  bookingFormSchema,
  BookingFormValues,
} from "../schemas/booking-form-schema";
import { buildStartDateTime } from "../utils/booking-formatters";
import { useBookingDraftStore } from "../store/booking-draft-store";
import { Loader2, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Stepper, Step } from "@/shared/components/ui/stepper";
import { LoginRequiredDialog } from "./login-required-dialog";
import { BookingStepProfessional } from "./booking-step-professional";
import { BookingStepServices } from "./booking-step-services";
import { BookingStepSchedule } from "./booking-step-schedule";
import { cn } from "@/shared/utils/utils";
import { BookingStepSummary } from "./booking-step-summary";

const STEPS: Step[] = [
  {
    title: "Profissional",
    description: "Escolha o profissional",
  },
  {
    title: "Serviços",
    description: "Selecione os serviços",
  },
  {
    title: "Horário",
    description: "Escolha data e hora",
  },
  {
    title: "Resumo",
    description: "Finalize o agendamento",
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
};

type BookingFormWizardProps = {
  onSuccess?: () => void;
  className?: string;
};

export function BookingFormWizard({ className }: BookingFormWizardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { draft, setDraft, clearDraft } = useBookingDraftStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const isSubmittingRef = useRef(false);

  const methods = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    mode: "onChange",
    defaultValues: {
      professionalId: draft.professionalId || "",
      date: draft.date || "",
      time: draft.time || "",
      services: draft.services || [],
      useBonusPoints: draft.useBonusPoints ?? false,
      notes: draft.notes || "",
      couponCode: draft.couponCode || "",
    },
  });

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting, isValid },
    trigger,
    setValue,
  } = methods;

  const professionalId = watch("professionalId");
  const selectedServices = watch("services") ?? [];
  const selectedDate = watch("date");
  const selectedTime = watch("time");
  const previousProfessionalIdRef = useRef("");

  const isDirty = methods.formState.isDirty;

  // Log on form element
  useEffect(() => {
    if (currentStep !== 3) return;

    const formElement = document.querySelector("form");
    if (!formElement) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
      }
    };

    formElement.addEventListener("keydown", handleKeyDown);

    return () => {
      formElement.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentStep]);

  // Auto-save draft
  useEffect(() => {
    if (!isDirty) return;

    const subscription = watch((values) => {
      setDraft(values as BookingFormValues);
    });
    return () => subscription.unsubscribe();
  }, [watch, setDraft, isDirty]);

  useEffect(() => {
    const previous = previousProfessionalIdRef.current;
    if (previous && previous !== professionalId) {
      setValue("services", [], { shouldValidate: true, shouldDirty: true });
      setValue("date", "", { shouldValidate: true, shouldDirty: true });
      setValue("time", "", { shouldValidate: true, shouldDirty: true });
      setValue("useBonusPoints", false, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("couponCode", "", { shouldValidate: true, shouldDirty: true });
    }

    previousProfessionalIdRef.current = professionalId || "";
  }, [professionalId, setValue]);

  const bonusQuery = useGetBonusBalance({
    query: {
      enabled: Boolean(user),
    },
  });

  const createBooking = useCreateBooking({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getListUserBookingsQueryKey(),
        });
        toast.success("Reserva criada com sucesso!", {
          icon: <CheckCircle2 className="h-4 w-4" />,
        });
        clearDraft();
        setCurrentStep(0);
        router.push("/");
      },
      onError: (error: unknown) => {
        const message =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Não foi possível criar a reserva.";
        toast.error(message);
      },
    },
  });

  const handleNext = async () => {
    setIsNavigating(true);

    try {
      let isValid = false;

      switch (currentStep) {
        case 0:
          isValid = await trigger("professionalId");
          break;
        case 1:
          isValid = await trigger("services");
          break;
        case 2:
          if (!user) {
            setShowLoginDialog(true);
            setIsNavigating(false);
            return;
          }
          isValid = await trigger(["date", "time"]);
          break;
        case 3:
          if (!user) {
            setShowLoginDialog(true);
            setIsNavigating(false);
            return;
          }
          isValid = true;
          break;
      }

      if (isValid) {
        const newStep = Math.min(currentStep + 1, STEPS.length - 1);
        setDirection(1);
        setCurrentStep(newStep);
      }
    } finally {
      setIsNavigating(false);
    }
  };

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleCreateBooking = useCallback(
    async (data: BookingFormValues) => {
      // Evitar submissões duplas
      if (isSubmittingRef.current) {
        return;
      }

      if (!user) {
        setShowLoginDialog(true);
        return;
      }

      // Proteger contra submissão em step errado
      if (currentStep !== STEPS.length - 1) {
        return;
      }

      isSubmittingRef.current = true;

      try {
        const startDateTime = buildStartDateTime(data.date, data.time);
        if (!startDateTime) {
          toast.error("Data ou horário inválido.");
          return;
        }

        await createBooking.mutateAsync({
          data: {
            professionalId: data.professionalId,
            services: data.services.map((serviceId) => ({ serviceId })),
            startDateTime,
            notes: data.notes || undefined,
            useBonusPoints: data.useBonusPoints ?? false,
            couponCode: data.couponCode || undefined,
          },
        });
      } finally {
        isSubmittingRef.current = false;
      }
    },
    [user, currentStep, createBooking],
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <BookingStepProfessional />;
      case 1:
        return <BookingStepServices />;
      case 2:
        return <BookingStepSchedule />;
      case 3:
        return <BookingStepSummary bonusBalance={bonusQuery.data} />;
      default:
        return null;
    }
  };

  const getStepValidation = () => {
    switch (currentStep) {
      case 0:
        return Boolean(professionalId);
      case 1:
        return selectedServices.length > 0;
      case 2:
        return Boolean(selectedDate && selectedTime);
      case 3:
        return true;
      default:
        return false;
    }
  };

  const isStepValid = getStepValidation();
  const isLastStep = currentStep === STEPS.length - 1;

  // Monitorar mudanças de estado que podem disparar submit
  useEffect(() => {
    if (isLastStep) {
      // Vazio
    }
  }, [isValid, isSubmitting, isLastStep]);

  return (
    <FormProvider {...methods}>
      <div className={cn("mx-auto w-full max-w-4xl", className)}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-stone-200 bg-white/90 p-4 shadow-xl backdrop-blur-sm sm:p-6 lg:p-8"
        >
          {/* Stepper responsivo */}
          <div className="mb-6 sm:mb-8">
            <Stepper steps={STEPS} currentStep={currentStep} className="px-0" />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="min-h-[400px]"
              >
                {renderCurrentStep()}
              </motion.div>
            </AnimatePresence>

            {/* Navegação responsiva */}
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0 || isNavigating}
                className={cn(
                  "flex items-center gap-2 transition-all",
                  currentStep === 0 && "pointer-events-none opacity-0",
                )}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Voltar</span>
                <span className="sm:hidden">Voltar</span>
              </Button>

              <div className="flex flex-1 justify-end">
                {!isLastStep ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={!isStepValid || isNavigating}
                    className={cn(
                      "bg-principal-600 hover:bg-principal-700 flex w-full items-center gap-2 sm:w-auto",
                      "transition-all duration-200",
                      isStepValid && "animate-pulse-slow",
                    )}
                  >
                    <span>Próximo</span>
                    <ArrowRight className="h-4 w-4" />
                    {isNavigating && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => {
                      console.log(
                        "[Button.onClick] Confirmando reserva (manual click, não submit)",
                      );
                      handleSubmit(handleCreateBooking)();
                    }}
                    disabled={
                      isSubmitting || createBooking.isPending || !isValid
                    }
                    className="from-principal-600 to-principal-500 hover:from-principal-700 hover:to-principal-600 relative w-full overflow-hidden bg-gradient-to-r sm:w-auto"
                  >
                    {isSubmitting || createBooking.isPending ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="hidden sm:inline">
                          Criando reserva...
                        </span>
                        <span className="sm:hidden">Criando...</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="hidden sm:inline">
                          Confirmar reserva
                        </span>
                        <span className="sm:hidden">Confirmar</span>
                      </span>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </motion.div>

        <LoginRequiredDialog
          open={showLoginDialog}
          onClose={() => setShowLoginDialog(false)}
          returnUrl={pathname}
        />
      </div>
    </FormProvider>
  );
}
