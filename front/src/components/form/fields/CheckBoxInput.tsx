"use client";

import { useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckboxField } from "../types";
import { cn } from "@/lib/utils";

export function CheckboxInput({ field }: { field: CheckboxField }) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const value = watch(field.name) || false;

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={field.name}
          checked={value}
          onCheckedChange={(checked) => {
            setValue(field.name, checked, { shouldValidate: true });
          }}
          disabled={field.disabled}
          className={cn(
            "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
            field.className,
          )}
        />
        {field.label && (
          <Label
            htmlFor={field.name}
            className={cn(
              "text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              field.required && "required",
            )}
          >
            {field.label}
          </Label>
        )}
      </div>

      {field.description && (
        <p className="text-muted-foreground text-sm">{field.description}</p>
      )}

      {errors[field.name] && (
        <p className="text-destructive text-sm font-medium">
          {errors[field.name]?.message as string}
        </p>
      )}
    </div>
  );
}
