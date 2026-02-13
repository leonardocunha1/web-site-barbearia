"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  holidayFormSchema,
  HolidayFormValues,
} from "../schemas/holiday-form-schema";

type HolidayFormModalProps = {
  onSubmit: (values: HolidayFormValues) => Promise<void>;
  onClose?: () => void;
  isSaving?: boolean;
};

export function HolidayFormModal({
  onSubmit,
  onClose,
  isSaving,
}: HolidayFormModalProps) {
  const methods = useForm<HolidayFormValues>({
    resolver: zodResolver(holidayFormSchema),
    defaultValues: {
      date: "",
      reason: "",
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="date">Data</Label>
          <Input id="date" type="date" {...register("date")} />
          {errors.date && (
            <p className="text-destructive text-sm font-medium">
              {errors.date.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason">Motivo</Label>
          <Input id="reason" {...register("reason")} />
          {errors.reason && (
            <p className="text-destructive text-sm font-medium">
              {errors.reason.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Salvando..." : "Adicionar"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
