"use client";

import { useFormContext } from "react-hook-form";
import { BaseInput } from "./BaseInput";
import { TextField } from "../types";
import { cn } from "@/shared/utils/utils";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";

export function TextInput({ field }: { field: TextField }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <BaseInput
      id={field.name}
      type={field.type}
      {...register(field.name)}
      placeholder={field.placeholder}
      error={getErrorMessage(errors[field.name]?.message)}
      className={cn(field.className)}
      disabled={field.disabled}
      readOnly={field.readOnly}
      label={field.label}
      required={field.required}
      description={field.description}
      icon={field.icon}
      labelProps={field.labelProps}
      autoComplete={field.autoComplete}
    />
  );
}


