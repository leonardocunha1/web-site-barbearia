"use client";

import { useEffect } from "react";
import { FormProvider, useForm, Controller } from "react-hook-form";
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
import { DatePicker } from "@/shared/components/ui/date-picker";
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
      expirationType: "DATE",
      description: "",
      active: true,
      ...initialValues,
    },
  });

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = methods;

  const scope = watch("scope");
  const expirationType = watch("expirationType");
  const couponType = watch("type");

  const handleDateChange = (
    name: "startDate" | "endDate",
    dateValue: string | undefined,
  ) => {
    if (!dateValue) {
      setValue(name, undefined, { shouldValidate: true });
      return;
    }
    // Converte para ISO String (YYYY-MM-DDTHH:mm:ss.sssZ) para satisfazer o Zod .datetime()
    const date = new Date(dateValue);
    if (!isNaN(date.getTime())) {
      setValue(name, date.toISOString(), { shouldValidate: true });
    }
  };

  // Helper para converter qualquer formato de data para YYYY-MM-DD
  const formatDateForDisplay = (value: string | undefined): string => {
    if (!value) return "";
    // Se já é YYYY-MM-DD, retorna como está
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    // Se é ISO string, extrai a data
    if (value.includes("T")) return value.split("T")[0];
    // Tenta criar uma data válida
    const date = new Date(value);
    if (!isNaN(date.getTime())) return date.toISOString().split("T")[0];
    return "";
  };

  // Define valor 0 quando tipo mudar para FREE
  useEffect(() => {
    if (couponType === "FREE") {
      setValue("value", 0, { shouldValidate: true });
    }
  }, [couponType, setValue]);

  const handleFormSubmit = async (values: CouponFormValues) => {
    try {
      await onSubmit(values);
      onClose?.();
    } catch (error) {
      // Erro será tratado pelo componente pai
      throw error;
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="code" className="text-foreground/70 font-mono text-[10px] tracking-widest uppercase">Código</Label>
            <Input id="code" {...register("code")} />
            {errors.code && (
              <p className="text-destructive text-xs">{errors.code.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-foreground/70 font-mono text-[10px] tracking-widest uppercase">Tipo</Label>
            <Select
              value={watch("type")}
              onValueChange={(v) =>
                setValue("type", v as "PERCENTAGE" | "FIXED" | "FREE", {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PERCENTAGE">Percentual</SelectItem>
                <SelectItem value="FIXED">Valor fixo</SelectItem>
                <SelectItem value="FREE">Grátis</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {couponType !== "FREE" && (
            <div className="space-y-2">
              <Label htmlFor="value" className="text-foreground/70 font-mono text-[10px] tracking-widest uppercase">Valor</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                {...register("value", { valueAsNumber: true })}
              />
              {errors.value && (
                <p className="text-destructive text-xs">
                  {errors.value.message}
                </p>
              )}
            </div>
          )}
          <div className="space-y-2">
            <Label className="text-foreground/70 font-mono text-[10px] tracking-widest uppercase">Escopo</Label>
            <Select
              value={scope}
              onValueChange={(v) =>
                setValue("scope", v as "GLOBAL" | "SERVICE" | "PROFESSIONAL", {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Escopo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GLOBAL">Global</SelectItem>
                <SelectItem value="SERVICE">Serviço</SelectItem>
                <SelectItem value="PROFESSIONAL">Profissional</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground/70 font-mono text-[10px] tracking-widest uppercase">Tipo de expiração</Label>
          <Select
            value={expirationType}
            onValueChange={(v) =>
              setValue("expirationType", v as "DATE" | "QUANTITY" | "BOTH", {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DATE">Por data</SelectItem>
              <SelectItem value="QUANTITY">Por quantidade</SelectItem>
              <SelectItem value="BOTH">Data e quantidade</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {expirationType !== "QUANTITY" && (
            <>
              <div className="space-y-2">
                <Label className="text-foreground/70 font-mono text-[10px] tracking-widest uppercase">Data início</Label>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={formatDateForDisplay(field.value)}
                      onChange={(d) => handleDateChange("startDate", d)}
                    />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/70 font-mono text-[10px] tracking-widest uppercase">Data fim *</Label>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={formatDateForDisplay(field.value)}
                      onChange={(d) => handleDateChange("endDate", d)}
                    />
                  )}
                />
                {errors.endDate && (
                  <p className="text-destructive text-xs">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </>
          )}

          {expirationType !== "DATE" && (
            <div className="space-y-2">
              <Label htmlFor="maxUses" className="text-foreground/70 font-mono text-[10px] tracking-widest uppercase">Máximo de usos *</Label>
              <Input
                id="maxUses"
                type="number"
                {...register("maxUses", { valueAsNumber: true })}
              />
              {errors.maxUses && (
                <p className="text-destructive text-xs">
                  {errors.maxUses.message}
                </p>
              )}
            </div>
          )}
        </div>

        {scope === "SERVICE" && (
          <div className="space-y-2">
            <Label className="text-foreground/70 font-mono text-[10px] tracking-widest uppercase">Serviço</Label>
            <Select
              value={watch("serviceId")}
              onValueChange={(v) =>
                setValue("serviceId", v, { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o serviço" />
              </SelectTrigger>
              <SelectContent>
                {services.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.serviceId && (
              <p className="text-destructive text-xs">
                {errors.serviceId.message}
              </p>
            )}
          </div>
        )}

        {scope === "PROFESSIONAL" && (
          <div className="space-y-2">
            <Label className="text-foreground/70 font-mono text-[10px] tracking-widest uppercase">Profissional</Label>
            <Select
              value={watch("professionalId")}
              onValueChange={(v) =>
                setValue("professionalId", v, { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o profissional" />
              </SelectTrigger>
              <SelectContent>
                {professionals.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.professionalId && (
              <p className="text-destructive text-xs">
                {errors.professionalId.message}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="description" className="text-foreground/70 font-mono text-[10px] tracking-widest uppercase">Descrição</Label>
          <Input id="description" {...register("description")} />
        </div>

        {mode === "edit" && (
          <label className="border-foreground/15 hover:border-foreground/40 flex cursor-pointer items-center gap-3 border-l-2 px-4 py-2 transition-colors">
            <Checkbox
              checked={Boolean(watch("active"))}
              onCheckedChange={(v) => setValue("active", Boolean(v))}
              className="data-[state=checked]:bg-foreground data-[state=checked]:border-foreground data-[state=checked]:text-background"
            />
            <span className="text-foreground text-sm font-medium">Ativo</span>
          </label>
        )}

        <div className="border-foreground/10 flex items-center justify-end gap-3 border-t pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="font-mono text-xs tracking-widest uppercase"
          >
            Cancelar
          </Button>
          <Button type="submit" variant="editorial" size="sm" disabled={isSaving}>
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
