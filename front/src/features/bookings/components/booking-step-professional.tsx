"use client";

import { useFormContext } from "react-hook-form";
import { useListOrSearchProfessionals } from "@/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { BookingFormValues } from "../schemas/booking-form-schema";
import { Loader2 } from "lucide-react";
import { BookingStepHeader } from "./booking-step-header";

export function BookingStepProfessional() {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<BookingFormValues>();

  const professionalId = watch("professionalId");

  const professionalsQuery = useListOrSearchProfessionals({
    page: 1,
    limit: 100,
    status: "active",
  });

  const professionalOptions =
    professionalsQuery.data?.professionals?.map((professional) => ({
      value: professional.id,
      label: professional.user.name,
      specialty: professional.specialty,
    })) ?? [];

  return (
    <div className="space-y-8">
      <BookingStepHeader
        step="01"
        title="Escolha o"
        highlight="profissional"
        description="Selecione com quem você quer agendar."
      />

      <div className="space-y-2">
        {professionalsQuery.isLoading ? (
          <div className="border-foreground/10 flex items-center justify-center border p-12">
            <Loader2 className="text-cobre-600 h-6 w-6 animate-spin" />
          </div>
        ) : (
          <Select
            value={professionalId}
            onValueChange={(value) =>
              setValue("professionalId", value, { shouldValidate: true })
            }
          >
            <SelectTrigger className="h-12 w-full">
              <SelectValue placeholder="Selecione um profissional" />
            </SelectTrigger>
            <SelectContent>
              {professionalOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <span className="font-medium">{option.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {errors.professionalId && (
          <p className="text-destructive text-sm font-medium">
            {errors.professionalId.message}
          </p>
        )}
      </div>
    </div>
  );
}
