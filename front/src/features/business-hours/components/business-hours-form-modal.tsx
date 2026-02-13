"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  businessHoursFormSchema,
  BusinessHoursFormValues,
} from "../schemas/business-hours-form-schema";

const dayOptions = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Segunda" },
  { value: 2, label: "Terca" },
  { value: 3, label: "Quarta" },
  { value: 4, label: "Quinta" },
  { value: 5, label: "Sexta" },
  { value: 6, label: "Sabado" },
];

type BusinessHoursFormModalProps = {
  mode: "create" | "edit";
  initialValues?: Partial<BusinessHoursFormValues>;
  onSubmit: (values: BusinessHoursFormValues) => Promise<void>;
  onClose?: () => void;
  isSaving?: boolean;
};

export function BusinessHoursFormModal({
  mode,
  initialValues,
  onSubmit,
  onClose,
  isSaving,
}: BusinessHoursFormModalProps) {
  const methods = useForm<BusinessHoursFormValues>({
    resolver: zodResolver(businessHoursFormSchema),
    defaultValues: {
      dayOfWeek: 1,
      opensAt: "08:00",
      closesAt: "18:00",
      breakStart: "",
      breakEnd: "",
      ...initialValues,
    },
  });

  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = methods;

  const submitHandler = async (values: BusinessHoursFormValues) => {
    await onSubmit({
      ...values,
      breakStart: values.breakStart || undefined,
      breakEnd: values.breakEnd || undefined,
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
        <div className="space-y-2">
          <Label>Dia da semana</Label>
          <Select
            value={String(methods.watch("dayOfWeek"))}
            onValueChange={(value) =>
              setValue("dayOfWeek", Number(value), { shouldValidate: true })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {dayOptions.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.dayOfWeek && (
            <p className="text-destructive text-sm font-medium">
              {errors.dayOfWeek.message}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="opensAt">Abertura</Label>
            <Input id="opensAt" type="time" {...register("opensAt")} />
            {errors.opensAt && (
              <p className="text-destructive text-sm font-medium">
                {errors.opensAt.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="closesAt">Fechamento</Label>
            <Input id="closesAt" type="time" {...register("closesAt")} />
            {errors.closesAt && (
              <p className="text-destructive text-sm font-medium">
                {errors.closesAt.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="breakStart">Inicio da pausa</Label>
            <Input id="breakStart" type="time" {...register("breakStart")} />
            {errors.breakStart && (
              <p className="text-destructive text-sm font-medium">
                {errors.breakStart.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="breakEnd">Fim da pausa</Label>
            <Input id="breakEnd" type="time" {...register("breakEnd")} />
            {errors.breakEnd && (
              <p className="text-destructive text-sm font-medium">
                {errors.breakEnd.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving
              ? "Salvando..."
              : mode === "create"
                ? "Adicionar"
                : "Salvar"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
