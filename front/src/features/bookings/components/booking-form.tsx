"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { useFormContext, useWatch } from "react-hook-form";
import { format } from "date-fns";
import {
  useListOrSearchProfessionals,
  useListProfessionalServices,
} from "@/api";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { DateInput } from "@/shared/components/form/fields/DateInput";
import { BookingFormValues } from "../schemas/booking-form-schema";
import { BookingServicesField } from "./booking-services-field";
import { BookingTimeField } from "./booking-time-field";
import { toScheduleDate } from "../utils/booking-formatters";
import { useBookingDraftStore } from "../store/booking-draft-store";
import {
  SparkleIcon,
  UserCircleIcon,
  CalendarIcon,
  ClockIcon,
  ScissorsIcon,
  TagIcon,
  NoteIcon,
} from "@phosphor-icons/react";
import { useProfessionalSchedule } from "../hooks/use-professional-schedule";
import { cn } from "@/shared/utils/utils";
import { FormError } from "@/shared/components/form/form-error";

const professionalSelectField = {
  name: "professionalId",
  type: "select" as const,
  label: "Profissional",
  placeholder: "Selecione um profissional",
  required: true,
};

const dateField = {
  name: "date",
  type: "date" as const,
  label: "Data",
  placeholder: "dd/mm/aaaa",
  required: true,
};

const labelClass =
  "text-foreground/70 font-mono text-[10px] tracking-widest uppercase flex items-center gap-2";

const requiredMark = (
  <span className="text-cobre-700" aria-hidden>
    *
  </span>
);

type BookingFormProps = {
  className?: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function BookingForm({ className }: BookingFormProps) {
  const { setDraft } = useBookingDraftStore();

  const {
    watch,
    register,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<BookingFormValues>();

  const professionalId = useWatch({ name: "professionalId", control }) ?? "";
  const selectedDate = useWatch({ name: "date", control }) ?? "";
  const selectedTime = useWatch({ name: "time", control }) ?? "";
  const selectedServicesRaw = useWatch({ name: "services", control });
  const useBonusPoints = useWatch({ name: "useBonusPoints", control }) ?? false;

  const selectedServices = useMemo(
    () => selectedServicesRaw ?? [],
    [selectedServicesRaw],
  );

  const servicesKey = useMemo(
    () => selectedServices.join(","),
    [selectedServices],
  );

  useEffect(() => {
    const subscription = watch((values) => {
      setDraft(values as BookingFormValues);
    });

    return () => subscription.unsubscribe();
  }, [watch, setDraft]);

  const minDate = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);

  const dateFieldState = useMemo(
    () => ({
      ...dateField,
      disabled: !professionalId || selectedServices.length === 0,
      minDate,
    }),
    [professionalId, selectedServices.length, minDate],
  );

  const scheduleDate = useMemo(
    () => toScheduleDate(selectedDate),
    [selectedDate],
  );

  const isDateValid = useMemo(() => Boolean(scheduleDate), [scheduleDate]);

  const previousSelectionRef = useRef({
    professionalId: "",
    date: "",
    servicesKey: "",
  });

  const previousProfessionalIdRef = useRef("");

  const professionalsQuery = useListOrSearchProfessionals({
    page: 1,
    limit: 100,
    status: "active",
  });

  const servicesQuery = useListProfessionalServices(
    professionalId,
    { page: 1, limit: 100, activeOnly: true },
    {
      query: {
        enabled: Boolean(professionalId),
      },
    },
  );

  useEffect(() => {
    const previousProfessionalId = previousProfessionalIdRef.current;
    if (previousProfessionalId && previousProfessionalId !== professionalId) {
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

  useEffect(() => {
    const previous = previousSelectionRef.current;
    const hasSelectionChanged =
      previous.professionalId !== professionalId ||
      previous.date !== selectedDate ||
      previous.servicesKey !== servicesKey;

    if (hasSelectionChanged && selectedTime) {
      setValue("time", "", { shouldValidate: true });
    }

    previousSelectionRef.current = {
      professionalId,
      date: selectedDate,
      servicesKey,
    };
  }, [professionalId, selectedDate, servicesKey, selectedTime, setValue]);

  const durationById = useMemo(() => {
    const services = servicesQuery.data?.services ?? [];
    return new Map(
      services.map((service) => [service.id, service.duration ?? 0]),
    );
  }, [servicesQuery.data?.services]);

  const totalDurationMinutes = useMemo(() => {
    if (!durationById.size || selectedServices.length === 0) return 0;

    return selectedServices.reduce(
      (total, serviceId) => total + (durationById.get(serviceId) ?? 0),
      0,
    );
  }, [durationById, selectedServices]);

  const formatDuration = useMemo(
    () => (minutes: number) => {
      if (!minutes) return "0 min";
      const hours = Math.floor(minutes / 60);
      const remaining = minutes % 60;

      if (hours && remaining) return `${hours}h ${remaining}min`;
      if (hours) return `${hours}h`;
      return `${remaining}min`;
    },
    [],
  );

  const scheduleQuery = useProfessionalSchedule({
    professionalId,
    date: selectedDate,
    serviceIds: selectedServices,
  });

  const isHoliday = Boolean(scheduleQuery.data?.isHoliday);
  const holidayReason = scheduleQuery.data?.holidayReason;

  const professionalOptions = useMemo(() => {
    return (
      professionalsQuery.data?.professionals?.map((professional) => ({
        value: professional.id,
        label: professional.user.name,
      })) ?? []
    );
  }, [professionalsQuery.data]);

  return (
    <div className={className ?? "space-y-6"}>
      {/* Profissional */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-2"
      >
        <Label className={labelClass}>
          <UserCircleIcon weight="duotone" className="text-cobre-700 h-4 w-4" />
          {professionalSelectField.label} {requiredMark}
        </Label>

        {professionalsQuery.isLoading ? (
          <Skeleton className="h-11 w-full" />
        ) : (
          <Select
            value={professionalId}
            onValueChange={(value) =>
              setValue("professionalId", value, { shouldValidate: true })
            }
            disabled={professionalsQuery.isLoading}
          >
            <SelectTrigger
              className={cn(
                "h-11 w-full",
                errors.professionalId &&
                  "border-destructive focus:border-destructive",
              )}
            >
              <SelectValue placeholder={professionalSelectField.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {professionalOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <FormError message={errors.professionalId?.message} />
      </motion.div>

      {/* Data e Horário */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="grid gap-4 md:grid-cols-2"
      >
        <div className="space-y-2">
          <Label className={labelClass}>
            <CalendarIcon weight="duotone" className="text-cobre-700 h-4 w-4" />
            Data {requiredMark}
          </Label>
          <DateInput field={dateFieldState} />
          <FormError message={errors.date?.message} />
        </div>

        <div className="space-y-2">
          <BookingTimeField
            timeSlots={scheduleQuery.data?.timeSlots ?? []}
            isLoading={scheduleQuery.isLoading}
            disabled={
              !professionalId ||
              selectedServices.length === 0 ||
              !isDateValid ||
              isHoliday
            }
            error={errors.time?.message}
          />
          {!isDateValid && selectedDate && (
            <p className="text-foreground/60 text-xs">
              Selecione uma data válida para ver os horários.
            </p>
          )}
          {isHoliday && (
            <div className="border-destructive/30 bg-destructive/5 text-destructive border-l-2 px-3 py-2 text-xs">
              <p className="font-medium">Dia indisponível (feriado).</p>
              {holidayReason && (
                <p className="text-destructive/80 mt-1">
                  Motivo: {holidayReason}
                </p>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Serviços */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.15, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between">
          <Label className={labelClass}>
            <ScissorsIcon weight="duotone" className="text-cobre-700 h-4 w-4" />
            Serviços {requiredMark}
          </Label>
          {totalDurationMinutes > 0 && (
            <span className="border-foreground/15 text-foreground/70 border px-2 py-0.5 font-mono text-[10px] tracking-widest uppercase">
              {formatDuration(totalDurationMinutes)}
            </span>
          )}
        </div>

        {servicesQuery.isLoading && professionalId ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="border-foreground/15 border p-4"
              >
                <div className="flex items-start gap-3">
                  <Skeleton className="h-4 w-4" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <BookingServicesField
            services={servicesQuery.data?.services ?? []}
            isLoading={false}
            disabled={!professionalId}
          />
        )}
        <FormError message={errors.services?.message} />
      </motion.div>

      {/* Observações e Cupom */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="grid gap-4 md:grid-cols-2"
      >
        <div className="space-y-2">
          <Label htmlFor="notes" className={labelClass}>
            <NoteIcon weight="duotone" className="text-cobre-700 h-4 w-4" />
            Observações
          </Label>
          <Textarea
            id="notes"
            rows={3}
            {...register("notes")}
            placeholder="Alguma observação? (opcional)"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
              }
            }}
            className="resize-none"
          />
          <FormError message={errors.notes?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="couponCode" className={labelClass}>
            <TagIcon weight="duotone" className="text-cobre-700 h-4 w-4" />
            Cupom
          </Label>
          <Input
            id="couponCode"
            {...register("couponCode")}
            placeholder="Digite o código"
            disabled={useBonusPoints}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
            className={cn(
              "h-11",
              useBonusPoints && "bg-muted opacity-60",
            )}
          />
          <FormError message={errors.couponCode?.message} />
          {useBonusPoints && (
            <p className="text-foreground/60 text-xs">
              Desative os pontos para usar cupom.
            </p>
          )}
        </div>
      </motion.div>

      {/* Pontos de bônus */}
      <motion.label
        htmlFor="useBonusPoints"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.25, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "flex cursor-pointer items-center gap-3 border-l-2 px-4 py-3 transition-colors",
          useBonusPoints
            ? "border-cobre-600 bg-cobre-50/40"
            : "border-foreground/15 hover:border-foreground/40",
        )}
      >
        <Checkbox
          id="useBonusPoints"
          checked={Boolean(useBonusPoints)}
          onCheckedChange={(value) => {
            const isChecked = Boolean(value);
            setValue("useBonusPoints", isChecked, {
              shouldValidate: true,
              shouldDirty: true,
            });
            if (isChecked) {
              setValue("couponCode", "", {
                shouldValidate: true,
                shouldDirty: true,
              });
            }
          }}
          className="data-[state=checked]:bg-foreground data-[state=checked]:border-foreground data-[state=checked]:text-background h-4 w-4"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-foreground text-sm font-medium">
              Usar pontos de bônus
            </span>
            <SparkleIcon
              weight="duotone"
              className={cn(
                "h-3.5 w-3.5 transition-colors",
                useBonusPoints ? "text-cobre-600" : "text-foreground/40",
              )}
            />
          </div>
          <p className="text-foreground/60 font-mono text-[10px] tracking-widest uppercase">
            Ganhe e acumule pontos para próximos agendamentos
          </p>
        </div>
      </motion.label>
    </div>
  );
}
