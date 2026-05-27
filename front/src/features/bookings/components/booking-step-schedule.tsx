"use client";

import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { useMemo } from "react";
import { BookingFormValues } from "../schemas/booking-form-schema";
import { DateInput } from "@/shared/components/form/fields/DateInput";
import { BookingTimeField } from "./booking-time-field";
import { useProfessionalSchedule } from "../hooks/use-professional-schedule";
import { toScheduleDate } from "../utils/booking-formatters";
import { BookingStepHeader } from "./booking-step-header";

export function BookingStepSchedule() {
  const { watch } = useFormContext<BookingFormValues>();

  const professionalId = watch("professionalId");
  const selectedDate = watch("date");
  const selectedServices = watch("services") ?? [];

  const minDate = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);

  const scheduleDate = useMemo(
    () => toScheduleDate(selectedDate),
    [selectedDate],
  );

  const isDateValid = Boolean(scheduleDate);

  const scheduleQuery = useProfessionalSchedule({
    professionalId,
    date: selectedDate,
    serviceIds: selectedServices,
  });

  const isHoliday = Boolean(scheduleQuery.data?.isHoliday);
  const holidayReason = scheduleQuery.data?.holidayReason;

  const dateField = {
    name: "date" as const,
    type: "date" as const,
    label: "Data",
    placeholder: "dd/mm/aaaa",
    required: true,
    disabled: !professionalId || selectedServices.length === 0,
    minDate,
  };

  return (
    <div className="space-y-8">
      <BookingStepHeader
        step="03"
        title="Escolha data e"
        highlight="horário"
        description="Selecione o melhor dia e horário para a sua reserva."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <DateInput field={dateField} />
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
                <p className="text-destructive/80 mt-1">Motivo: {holidayReason}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {scheduleQuery.data && scheduleQuery.data.timeSlots.length === 0 && (
        <div className="border-foreground/20 border border-dashed p-6 text-center">
          <p className="text-foreground text-sm font-medium">
            Não há horários disponíveis para esta data.
          </p>
          <p className="text-foreground/60 mt-1 text-xs">
            Tente selecionar outro dia.
          </p>
        </div>
      )}
    </div>
  );
}
