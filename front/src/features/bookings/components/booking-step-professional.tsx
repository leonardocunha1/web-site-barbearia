"use client";

import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
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
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-stone-900">
          Escolha o profissional
        </h3>
        <p className="text-muted-foreground mt-2">
          Selecione o profissional com quem deseja agendar
        </p>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="space-y-2">
          {professionalsQuery.isLoading ? (
            <div className="flex items-center justify-center rounded-md border border-stone-200 p-12">
              <Loader2 className="text-principal-600 h-6 w-6 animate-spin" />
            </div>
          ) : (
            <Select
              value={professionalId}
              onValueChange={(value) =>
                setValue("professionalId", value, { shouldValidate: true })
              }
            >
              <SelectTrigger className="focus:border-principal-400 focus:ring-principal-200 h-12 w-full border-stone-200 transition-all">
                <SelectValue placeholder="Selecione um profissional" />
              </SelectTrigger>
              <SelectContent>
                {professionalOptions.map((option, index) => (
                  <motion.div
                    key={option.value}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <SelectItem value={option.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                      </div>
                    </SelectItem>
                  </motion.div>
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
    </div>
  );
}
