"use client";

import {
  InputHTMLAttributes,
  JSXElementConstructor,
  LabelHTMLAttributes,
} from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ErrorMessage } from "@/components/ui/error-message";

type BaseInputProps = InputHTMLAttributes<HTMLInputElement> & {
  register?: UseFormRegisterReturn;
  error?: string;
  label?: string;
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>;
  description?: string;
  required?: boolean;
  icon?: React.ElementType | JSXElementConstructor<{ className?: string }>;
  onValueChange?: (value: string) => void;
};

export function BaseInput({
  register,
  error,
  className,
  label,
  labelProps,
  description,
  required,
  id,
  icon: Icon,
  onValueChange,
  ...props
}: BaseInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    register?.onChange(e);
    onValueChange?.(e.target.value);
    props.onChange?.(e);
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label
          htmlFor={id}
          {...labelProps}
          className={cn("text-sm font-medium", labelProps?.className)}
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </Label>
      )}

      <div className="relative">
        {Icon && (
          <Icon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        )}
        <Input
          id={id}
          {...register}
          {...props}
          className={cn(
            error && "border-red-500 focus-visible:ring-red-500",
            Icon && "pl-10",
            className,
          )}
          onChange={handleChange}
        />
      </div>

      {error ? (
        <ErrorMessage message={error} />
      ) : description ? (
        <p className="text-muted-foreground text-sm">{description}</p>
      ) : null}
    </div>
  );
}
