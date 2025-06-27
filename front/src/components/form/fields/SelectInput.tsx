"use client";

import { useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectField } from "../types";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ErrorMessage } from "@/components/ui/error-message";

export function SelectInput({ field }: { field: SelectField }) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const value = watch(field.name) || "";

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

      <Select
        value={value}
        onValueChange={(val) =>
          setValue(field.name, val, { shouldValidate: true })
        }
        disabled={field.disabled}
      >
        <SelectTrigger className={cn("w-full", field.className)}>
          <SelectValue placeholder={field.placeholder || "Selecione..."} />
        </SelectTrigger>
        <SelectContent>
          {field.placeholder && (
            <SelectItem value="">{field.placeholder}</SelectItem>
          )}
          {field.options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {field.description && !errors[field.name] && (
        <p className="text-muted-foreground text-sm">{field.description}</p>
      )}

      {errors[field.name] && (
        <ErrorMessage message={errors[field.name]?.message as string} />
      )}
    </div>
  );
}
