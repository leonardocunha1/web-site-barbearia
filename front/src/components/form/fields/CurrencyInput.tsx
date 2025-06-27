"use client";

import { useFormContext } from "react-hook-form";
import CurrencyInput from "react-currency-input-field";
import { CurrencyField } from "../types";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@/components/ui/error-message";

export function CurrencyInputComponent({ field }: { field: CurrencyField }) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const value = watch(field.name) ?? "";

  return (
    <div className="space-y-2">
      {field.label && (
        <Label
          htmlFor={field.name}
          className={cn(field.required && "required")}
        >
          {field.label}
        </Label>
      )}

      <CurrencyInput
        id={field.name}
        name={field.name}
        value={value}
        onValueChange={(value) => {
          setValue(field.name, value, { shouldValidate: true });
        }}
        placeholder={field.placeholder || "0,00"}
        decimalSeparator={field.currencyOptions?.decimalSeparator ?? ","}
        groupSeparator={field.currencyOptions?.groupSeparator ?? "."}
        prefix={field.currencyOptions?.prefix ?? "R$ "}
        suffix={field.currencyOptions?.suffix}
        decimalsLimit={field.currencyOptions?.decimalsLimit ?? 2}
        className={cn(
          "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          field.className,
          errors[field.name] &&
            "border-destructive focus-visible:ring-destructive",
        )}
        disabled={field.disabled}
      />

      <ErrorMessage message={errors[field.name]?.message as string} />
    </div>
  );
}
