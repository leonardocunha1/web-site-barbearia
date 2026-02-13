"use client";

import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { useMemo } from "react";
import { BookingFormValues } from "../schemas/booking-form-schema";
import { DateInput } from "@/shared/components/form/fields/DateInput";
import { BookingTimeField } from "./booking-time-field";
import { useProfessionalSchedule } from "../hooks/use-professional-schedule";
import { toScheduleDate } from "../utils/booking-formatters";

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
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-stone-900">
          Escolha data e horário
        </h3>
        <p className="text-muted-foreground mt-2">
          Selecione o melhor dia e horário para seu agendamento
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <DateInput field={dateField} />
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <BookingTimeField
            timeSlots={scheduleQuery.data?.timeSlots ?? []}
            isLoading={scheduleQuery.isLoading}
            disabled={
              !professionalId || selectedServices.length === 0 || !isDateValid
            }
          />
          {!isDateValid && selectedDate && (
            <p className="text-muted-foreground mt-2 text-xs">
              Selecione uma data válida para ver os horários.
            </p>
          )}
        </div>
      </div>

      {scheduleQuery.data && scheduleQuery.data.timeSlots.length === 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
          <p className="text-sm font-medium text-amber-900">
            Não há horários disponíveis para esta data.
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            Tente selecionar outro dia.
          </p>
        </div>
      )}
    </div>
  );
}
