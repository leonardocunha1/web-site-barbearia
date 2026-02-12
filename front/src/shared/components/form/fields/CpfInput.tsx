"use client";

import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { mask as masker, unMask } from "remask";
import { BaseInput } from "./BaseInput";
import { CpfField } from "../types";
import { cn } from "@/shared/utils/utils";

export function CpfInput({ field }: { field: CpfField }) {
  const {
    setValue,
    watch,
    formState: { errors },
    trigger,
  } = useFormContext();

  const [cpfValue, setCpfValue] = useState("");
  const rawValue = watch(field.name) || "";

  // Aplica máscara quando o valor muda
  useEffect(() => {
    const maskedValue = masker(unMask(rawValue), "999.999.999-99");
    setCpfValue(maskedValue);
  }, [rawValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = unMask(e.target.value);
    const maskedValue = masker(rawValue, "999.999.999-99");
    setValue(field.name, maskedValue, { shouldValidate: false });
  };

  const handleBlur = () => {
    trigger(field.name); // Dispara a validação
  };

  return (
    <BaseInput
      id={field.name}
      type="text"
      inputMode="numeric"
      value={cpfValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={field.placeholder || "000.000.000-00"}
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

