"use client";

import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TextareaField } from "../types";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/helper/getErrorMessage";

export function TextareaInput({ field }: { field: TextareaField }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

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

      <Textarea
        id={field.name}
        {...register(field.name)}
        placeholder={field.placeholder}
        className={cn(
          "min-h-[100px] resize-y",
          field.className,
          errors[field.name] &&
            "border-destructive focus-visible:ring-destructive",
        )}
        disabled={field.disabled}
        readOnly={field.readOnly}
        rows={field.rows || 3}
      />

      {field.description && !errors[field.name] && (
        <p className="text-muted-foreground text-sm">{field.description}</p>
      )}

      {errors[field.name] && (
        <p className="text-destructive text-sm font-medium">
          {getErrorMessage(errors[field.name])}
        </p>
      )}
    </div>
  );
}
