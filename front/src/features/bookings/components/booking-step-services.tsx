"use client";

import { useFormContext } from "react-hook-form";
import { useListProfessionalServices } from "@/api";
import { BookingFormValues } from "../schemas/booking-form-schema";
import { BookingServicesField } from "./booking-services-field";
import { useMemo } from "react";

export function BookingStepServices() {
  const { watch } = useFormContext<BookingFormValues>();

  const professionalId = watch("professionalId");
  const selectedServicesValue = watch("services");
  const selectedServices = useMemo(
    () => selectedServicesValue ?? [],
    [selectedServicesValue],
  );

  const servicesQuery = useListProfessionalServices(
    professionalId,
    { page: 1, limit: 100, activeOnly: true },
    {
      query: {
        enabled: Boolean(professionalId),
      },
    },
  );

  const totalDurationMinutes = useMemo(() => {
    const services = servicesQuery.data?.services ?? [];
    if (!services.length || selectedServices.length === 0) return 0;

    const durationById = new Map(
      services.map((service) => [service.id, service.duration ?? 0]),
    );

    return selectedServices.reduce(
      (total, serviceId) => total + (durationById.get(serviceId) ?? 0),
      0,
    );
  }, [servicesQuery.data?.services, selectedServices]);

  const formatDuration = (minutes: number) => {
    if (!minutes) return "0 min";
    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;

    if (hours && remaining) return `${hours}h ${remaining}min`;
    if (hours) return `${hours}h`;
    return `${remaining}min`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-stone-900">
          Escolha os serviços
        </h3>
        <p className="text-muted-foreground mt-2">
          Selecione um ou mais serviços para seu agendamento
        </p>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <BookingServicesField
          services={servicesQuery.data?.services ?? []}
          isLoading={servicesQuery.isLoading}
          disabled={!professionalId}
        />
      </div>

      {totalDurationMinutes > 0 && (
        <div className="border-principal-200 bg-principal-50 rounded-lg border p-4">
          <p className="text-sm font-medium text-stone-900">
            Duração total estimada:{" "}
            <span className="text-principal-700">
              {formatDuration(totalDurationMinutes)}
            </span>
          </p>
        </div>
      )}

      {/* {errors.services && (
        <p className="text-destructive text-sm font-medium">
          {errors.services.message}
        </p>
      )} */}
    </div>
  );
}
