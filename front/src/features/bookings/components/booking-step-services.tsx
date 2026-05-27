"use client";

import { useFormContext } from "react-hook-form";
import { useListProfessionalServices } from "@/api";
import { BookingFormValues } from "../schemas/booking-form-schema";
import { BookingServicesField } from "./booking-services-field";
import { BookingStepHeader } from "./booking-step-header";

export function BookingStepServices() {
  const { watch } = useFormContext<BookingFormValues>();

  const professionalId = watch("professionalId");

  const servicesQuery = useListProfessionalServices(
    professionalId,
    { page: 1, limit: 100, activeOnly: true },
    {
      query: {
        enabled: Boolean(professionalId),
      },
    },
  );

  return (
    <div className="space-y-8">
      <BookingStepHeader
        step="02"
        title="Selecione os"
        highlight="serviços"
        description="Em Corte, Barba e Sobrancelha você escolhe apenas 1 por tipo. Em Estética você pode combinar mais de um."
      />

      <BookingServicesField
        services={servicesQuery.data?.services ?? []}
        isLoading={servicesQuery.isLoading}
        disabled={!professionalId}
      />
    </div>
  );
}
