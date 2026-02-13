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
  Sparkles,
  User,
  Calendar,
  Clock,
  Scissors,
  Tag,
  FileText,
} from "lucide-react";
import { useProfessionalSchedule } from "../hooks/use-professional-schedule";

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

type BookingFormProps = {
  className?: string;
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

  // Query para obter horários disponíveis
  const scheduleQuery = useProfessionalSchedule({
    professionalId,
    date: selectedDate,
    serviceIds: selectedServices,
  });

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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-stone-500" />
          <Label className="text-sm font-medium text-stone-700">
            {professionalSelectField.label}{" "}
            <span className="text-principal-600">*</span>
          </Label>
        </div>

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
                "h-11 w-full border-stone-200 bg-white/50 transition-all",
                "focus:border-principal-400 focus:ring-principal-200",
                errors.professionalId &&
                  "border-destructive focus:border-destructive",
              )}
            >
              <SelectValue placeholder={professionalSelectField.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {professionalOptions.map((option, index) => (
                <motion.div
                  key={option.value}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <SelectItem value={option.value}>{option.label}</SelectItem>
                </motion.div>
              ))}
            </SelectContent>
          </Select>
        )}
        <FormError message={errors.professionalId?.message} />
      </motion.div>

      {/* Data e Horário */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid gap-4 md:grid-cols-2"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-stone-500" />
            <Label className="text-sm font-medium text-stone-700">
              Data <span className="text-principal-600">*</span>
            </Label>
          </div>
          <DateInput field={dateFieldState} />
          <FormError message={errors.date?.message} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-stone-500" />
            <Label className="text-sm font-medium text-stone-700">
              Horário <span className="text-principal-600">*</span>
            </Label>
          </div>
          <BookingTimeField
            timeSlots={scheduleQuery.data?.timeSlots ?? []}
            isLoading={scheduleQuery.isLoading}
            disabled={
              !professionalId || selectedServices.length === 0 || !isDateValid
            }
            error={errors.time?.message}
          />
          {!isDateValid && selectedDate && (
            <p className="text-xs text-amber-600">
              Selecione uma data válida para ver os horários.
            </p>
          )}
        </div>
      </motion.div>

      {/* Serviços */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scissors className="h-4 w-4 text-stone-500" />
            <Label className="text-sm font-medium text-stone-700">
              Serviços <span className="text-principal-600">*</span>
            </Label>
          </div>
          {totalDurationMinutes > 0 && (
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
              {formatDuration(totalDurationMinutes)}
            </span>
          )}
        </div>

        {servicesQuery.isLoading && professionalId ? (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-lg border border-stone-200 bg-white p-4"
                >
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-4 w-4 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid gap-4 md:grid-cols-2"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-stone-500" />
            <Label
              htmlFor="notes"
              className="text-sm font-medium text-stone-700"
            >
              Observações
            </Label>
          </div>
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
            className={cn(
              "resize-none border-stone-200 bg-white/50 transition-all",
              "focus:border-principal-400 focus:ring-principal-200",
              "placeholder:text-stone-400",
            )}
          />
          <FormError message={errors.notes?.message} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-stone-500" />
            <Label
              htmlFor="couponCode"
              className="text-sm font-medium text-stone-700"
            >
              Cupom
            </Label>
          </div>
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
              "h-11 border-stone-200 bg-white/50 transition-all",
              "focus:border-principal-400 focus:ring-principal-200",
              "placeholder:text-stone-400",
              useBonusPoints && "bg-stone-100 opacity-60",
            )}
          />
          <FormError message={errors.couponCode?.message} />
          {useBonusPoints && (
            <p className="text-xs text-amber-600">
              Desative os pontos para usar cupom.
            </p>
          )}
        </div>
      </motion.div>

      {/* Pontos de bônus */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.01 }}
        className={cn(
          "flex items-center gap-3 rounded-lg border p-3 transition-all",
          useBonusPoints
            ? "border-principal-200 bg-principal-50"
            : "border-stone-200 bg-stone-50",
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
          className={cn(
            "h-4 w-4 rounded border-2 transition-all",
            useBonusPoints
              ? "border-principal-600 bg-principal-600 data-[state=checked]:bg-principal-600"
              : "data-[state=checked]:border-principal-600 data-[state=checked]:bg-principal-600 border-stone-300",
          )}
        />
        <div className="flex-1">
          <Label
            htmlFor="useBonusPoints"
            className="flex cursor-pointer items-center gap-2 text-sm font-medium text-stone-700"
          >
            Usar pontos de bônus
            <Sparkles
              className={cn(
                "h-3.5 w-3.5 transition-colors",
                useBonusPoints ? "text-principal-600" : "text-stone-400",
              )}
            />
          </Label>
          <p className="text-xs text-stone-500">
            Ganhe e acumule pontos para próximos agendamentos
          </p>
        </div>
      </motion.div>
    </div>
  );
}

import { cn } from "@/shared/utils/utils";
import { FormError } from "@/shared/components/form/form-error";
