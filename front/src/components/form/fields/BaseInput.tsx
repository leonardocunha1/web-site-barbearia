"use client";

import {
  InputHTMLAttributes,
  JSXElementConstructor,
  LabelHTMLAttributes,
  useState,
} from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ErrorMessage } from "@/components/ui/error-message";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

type BaseInputProps = InputHTMLAttributes<HTMLInputElement> & {
  register?: UseFormRegisterReturn;
  error?: string;
  label?: string;
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>;
  description?: string;
  required?: boolean;
  icon?: React.ElementType | JSXElementConstructor<{ className?: string }>;
  onValueChange?: (value: string) => void;
  showPasswordToggle?: boolean;
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
  type,
  showPasswordToggle = type === "password", // Mostra toggle apenas para senhas
  ...props
}: BaseInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    register?.onChange(e);
    onValueChange?.(e.target.value);
    props.onChange?.(e);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          type={showPasswordToggle && showPassword ? "text" : type}
          className={cn(
            error && "border-destructive focus-visible:ring-destructive",
            Icon && "pl-10",
            showPasswordToggle && "pr-10",
            className,
          )}
          onChange={handleChange}
        />

        {showPasswordToggle && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute top-0 right-0 h-full cursor-pointer px-3 hover:bg-transparent"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <EyeOff className="text-muted-foreground h-4 w-4" />
            ) : (
              <Eye className="text-muted-foreground h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {error ? (
        <ErrorMessage message={error} />
      ) : description ? (
        <p className="text-muted-foreground text-sm">{description}</p>
      ) : null}
    </div>
  );
}
