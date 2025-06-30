"use client";

import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { BaseInput } from "./BaseInput";
import { PhoneField } from "../types";
import { cn } from "@/lib/utils";

function formatPhoneNumber(inputValue: string | undefined | null): string {
  if (!inputValue) return "";

  inputValue = inputValue.replace(/\D/g, "");
  inputValue = inputValue.replace(/(^\d{2})(\d)/, "($1) $2");
  inputValue = inputValue.replace(/(\d{4,5})(\d{4}$)/, "$1-$2");

  if (inputValue.length > 15) {
    inputValue = inputValue.replace(/\D/g, "");
    inputValue = inputValue.substring(0, 11);
    inputValue = inputValue.replace(/(^\d{2})(\d)/, "($1) $2");
    inputValue = inputValue.replace(/(\d{4,5})(\d{4}$)/, "$1-$2");
  }

  return inputValue;
}

export function PhoneInput({ field }: { field: PhoneField }) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const formValue = watch(field.name) || "";
  const [localValue, setLocalValue] = useState(formValue);

  useEffect(() => {
    if (formValue !== localValue) {
      setLocalValue(formValue);
    }
  }, [formValue, localValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatPhoneNumber(rawValue);

    setLocalValue(formattedValue);
    setValue(field.name, formattedValue, { shouldValidate: true });
  };

  return (
    <BaseInput
      id={field.name}
      type="tel"
      value={localValue}
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
      labelProps={field.labelProps}
    />
  );
}
