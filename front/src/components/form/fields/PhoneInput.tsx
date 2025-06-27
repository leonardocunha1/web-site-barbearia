"use client";

import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { mask as masker, unMask } from "remask";
import { BaseInput } from "./BaseInput";
import { PhoneField } from "../types";
import { cn } from "@/lib/utils";

export function PhoneInput({ field }: { field: PhoneField }) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const phoneValue = watch(field.name) || "";
  const [mask, setMask] = useState(
    field.mask || ["(99) 9999-9999", "(99) 99999-9999"],
  );

  useEffect(() => {
    // Atualiza a máscara com base no tamanho do valor
    const cleanValue = unMask(phoneValue);
    if (cleanValue.length > 10) {
      setMask("(99) 99999-9999");
    } else {
      setMask("(99) 9999-9999");
    }
  }, [phoneValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const originalValue = unMask(e.target.value);
    const maskedValue = masker(originalValue, mask);
    setValue(field.name, maskedValue, { shouldValidate: true });
  };

  return (
    <BaseInput
      id={field.name}
      type="tel"
      value={phoneValue}
      onChange={handleChange}
      onBlur={register(field.name).onBlur}
      placeholder={field.placeholder || "(00) 00000-0000"}
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
