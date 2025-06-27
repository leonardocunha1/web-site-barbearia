"use client";

import { useFormContext } from "react-hook-form";
import { useEffect } from "react";
import { BaseInput } from "./BaseInput";
import { NumberField } from "../types";
import { cn } from "@/lib/utils";

export function NumberInput({ field }: { field: NumberField }) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const value = watch(field.name) || "";

  // Garante que o valor esteja dentro dos limites min/max
  useEffect(() => {
    if (value === "") return;

    const numValue = Number(value);
    if (field.min !== undefined && numValue < field.min) {
      setValue(field.name, field.min, { shouldValidate: true });
    } else if (field.max !== undefined && numValue > field.max) {
      setValue(field.name, field.max, { shouldValidate: true });
    }
  }, [value, field.min, field.max, field.name, setValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Remove caracteres não numéricos
    value = value.replace(/[^0-9.]/g, "");

    // Permite apenas um ponto decimal
    const decimalParts = value.split(".");
    if (decimalParts.length > 2) {
      value = `${decimalParts[0]}.${decimalParts.slice(1).join("")}`;
    }

    setValue(field.name, value, { shouldValidate: true });
  };

  return (
    <BaseInput
      id={field.name}
      type="text" // Usamos text para melhor controle da entrada
      inputMode="decimal" // Teclado numérico em dispositivos móveis
      value={value}
      onChange={handleChange}
      onBlur={() => {
        // Formata o valor final
        if (value !== "") {
          const numValue = Number(value);
          setValue(field.name, numValue, { shouldValidate: true });
        }
      }}
      placeholder={field.placeholder}
      error={errors[field.name]?.message as string}
      className={cn(field.className)}
      disabled={field.disabled}
      readOnly={field.readOnly}
      label={field.label}
      required={field.required}
      description={field.description}
      icon={field.icon}
    />
  );
}
