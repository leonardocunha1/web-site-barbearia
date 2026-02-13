"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  couponFormSchema,
  CouponFormValues,
} from "../schemas/coupon-form-schema";

type Option = { value: string; label: string };

type CouponFormModalProps = {
  mode: "create" | "edit";
  initialValues?: Partial<CouponFormValues>;
  onSubmit: (values: CouponFormValues) => Promise<void>;
  isSaving?: boolean;
  onClose?: () => void;
  services: Option[];
  professionals: Option[];
};

const typeOptions: Option[] = [
  { value: "PERCENTAGE", label: "Percentual" },
  { value: "FIXED", label: "Valor fixo" },
  { value: "FREE", label: "Gratis" },
];

const scopeOptions: Option[] = [
  { value: "GLOBAL", label: "Global" },
  { value: "SERVICE", label: "Servico" },
  { value: "PROFESSIONAL", label: "Profissional" },
];

export function CouponFormModal({
  mode,
  initialValues,
  onSubmit,
  isSaving,
  onClose,
  services,
  professionals,
}: CouponFormModalProps) {
  const methods = useForm<CouponFormValues>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: "",
      type: "PERCENTAGE",
      value: 0,
      scope: "GLOBAL",
      description: "",
      maxUses: undefined,
      startDate: "",
      endDate: "",
      minBookingValue: undefined,
      serviceId: "",
      professionalId: "",
      active: true,
      ...initialValues,
    },
  });

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;

  const scope = watch("scope");

  const submitHandler = async (values: CouponFormValues) => {
    await onSubmit({
      ...values,
      maxUses: Number.isNaN(values.maxUses) ? undefined : values.maxUses,
      minBookingValue: Number.isNaN(values.minBookingValue)
        ? undefined
        : values.minBookingValue,
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="code">Codigo</Label>
            <Input id="code" {...register("code")} />
            {errors.code && (
              <p className="text-destructive text-sm font-medium">
                {errors.code.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select
              value={watch("type")}
              onValueChange={(value) =>
                setValue("type", value as CouponFormValues["type"], {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-destructive text-sm font-medium">
                {errors.type.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="value">Valor</Label>
            <Input
              id="value"
              type="number"
              step="0.01"
              {...register("value", { valueAsNumber: true })}
            />
            {errors.value && (
              <p className="text-destructive text-sm font-medium">
                {errors.value.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Escopo</Label>
            <Select
              value={scope}
              onValueChange={(value) =>
                setValue("scope", value as CouponFormValues["scope"], {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Escopo" />
              </SelectTrigger>
              <SelectContent>
                {scopeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.scope && (
              <p className="text-destructive text-sm font-medium">
                {errors.scope.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="startDate">Inicio</Label>
            <Input id="startDate" type="date" {...register("startDate")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">Fim</Label>
            <Input id="endDate" type="date" {...register("endDate")} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="maxUses">Maximo de usos</Label>
            <Input
              id="maxUses"
              type="number"
              {...register("maxUses", { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minBookingValue">Valor minimo</Label>
            <Input
              id="minBookingValue"
              type="number"
              step="0.01"
              {...register("minBookingValue", { valueAsNumber: true })}
            />
          </div>
        </div>

        {scope === "SERVICE" && (
          <div className="space-y-2">
            <Label>Servico</Label>
            <Select
              value={watch("serviceId") || ""}
              onValueChange={(value) =>
                setValue("serviceId", value, { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o servico" />
              </SelectTrigger>
              <SelectContent>
                {services.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.serviceId && (
              <p className="text-destructive text-sm font-medium">
                {errors.serviceId.message}
              </p>
            )}
          </div>
        )}

        {scope === "PROFESSIONAL" && (
          <div className="space-y-2">
            <Label>Profissional</Label>
            <Select
              value={watch("professionalId") || ""}
              onValueChange={(value) =>
                setValue("professionalId", value, { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o profissional" />
              </SelectTrigger>
              <SelectContent>
                {professionals.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.professionalId && (
              <p className="text-destructive text-sm font-medium">
                {errors.professionalId.message}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="description">Descricao</Label>
          <Input id="description" {...register("description")} />
        </div>

        {mode === "edit" && (
          <div className="flex items-center gap-3">
            <Checkbox
              checked={Boolean(watch("active"))}
              onCheckedChange={(value) =>
                setValue("active", Boolean(value), { shouldValidate: true })
              }
            />
            <Label>Ativo</Label>
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving
              ? "Salvando..."
              : mode === "create"
                ? "Criar cupom"
                : "Salvar"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
