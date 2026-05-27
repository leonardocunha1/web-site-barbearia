"use client";

import { useFormContext } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Label } from "@/shared/components/ui/label";
import { LoadingState } from "@/shared/components/ui/loading-state";
import type { BookingFormValues } from "../schemas/booking-form-schema";
import type { GetProfessionalSchedule200TimeSlotsItem } from "@/api";
import { Clock, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/shared/utils/utils";
import { useMemo } from "react";

type BookingTimeFieldProps = {
  timeSlots: GetProfessionalSchedule200TimeSlotsItem[];
  isLoading?: boolean;
  disabled?: boolean;
  error?: string;
  compact?: boolean;
};

export function BookingTimeField({
  timeSlots,
  isLoading,
  disabled,
  error,
}: BookingTimeFieldProps) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<BookingFormValues>();

  const value = watch("time") ?? "";

  const availableSlots = useMemo(
    () => timeSlots.filter((slot) => slot.available),
    [timeSlots],
  );

  const hasNoSlots = !isLoading && availableSlots.length === 0 && !disabled;

  // Agrupar horários por período
  const slotsByPeriod = useMemo(() => {
    const periods = {
      manha: { label: "Manhã", slots: [] as string[] },
      tarde: { label: "Tarde", slots: [] as string[] },
      noite: { label: "Noite", slots: [] as string[] },
    };

    availableSlots.forEach((slot) => {
      const hour = parseInt(slot.time.split(":")[0], 10);
      if (hour < 12) periods.manha.slots.push(slot.time);
      else if (hour < 18) periods.tarde.slots.push(slot.time);
      else periods.noite.slots.push(slot.time);
    });

    return periods;
  }, [availableSlots]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-foreground/70 flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase">
          <Clock className="h-3 w-3" />
          Horário <span className="text-cobre-700">*</span>
        </Label>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center"
          >
            <LoadingState message="Carregando..." size="sm" variant="inline" />
          </motion.div>
        )}
      </div>

      <Select
        value={value}
        onValueChange={(val) => setValue("time", val, { shouldValidate: true })}
        disabled={disabled || isLoading || availableSlots.length === 0}
      >
        <SelectTrigger
          className={cn(
            "h-11 w-full",
            error && "border-destructive focus:border-destructive",
          )}
        >
          <SelectValue
            placeholder={getPlaceholder({ isLoading, disabled, hasNoSlots })}
          />
        </SelectTrigger>

        <SelectContent className="max-h-[300px]">
          {Object.entries(slotsByPeriod).map(
            ([key, period]) =>
              period.slots.length > 0 && (
                <div key={key}>
                  <div className="text-foreground/50 px-2 py-1.5 font-mono text-[10px] tracking-widest uppercase">
                    {period.label}
                  </div>
                  {period.slots.map((time) => (
                    <SelectItem key={time} value={time}>
                      <span className="font-mono">{time}</span>
                    </SelectItem>
                  ))}
                </div>
              ),
          )}
        </SelectContent>
      </Select>

      {/* Mensagem quando não há horários */}
      <AnimatePresence>
        {hasNoSlots && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-foreground/20 text-foreground/70 flex items-center gap-2 border-l-2 px-3 py-2 text-xs"
          >
            <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
            <span>Não há horários disponíveis para esta data.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {(error || errors.time?.message) && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-destructive text-sm font-medium"
        >
          {error || errors.time?.message}
        </motion.p>
      )}
    </div>
  );
}

function getPlaceholder({
  isLoading,
  disabled,
  hasNoSlots,
}: {
  isLoading?: boolean;
  disabled?: boolean;
  hasNoSlots?: boolean;
}) {
  if (isLoading) return "Carregando horários...";
  if (disabled) return "Selecione profissional, serviços e data primeiro";
  if (hasNoSlots) return "Sem horários disponíveis";
  return "Selecione um horário";
}
