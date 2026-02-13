"use client";

import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { mask as masker, unMask } from "remask";
import { BaseInput } from "./BaseInput";
import { DateField } from "../types";
import { cn } from "@/shared/utils/utils";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import { format, isValid, parse, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export function DateInput({ field }: { field: DateField }) {
  const {
    setValue,
    watch,
    formState: { errors },
    trigger,
  } = useFormContext();

  const [dateValue, setDateValue] = useState("");
  const rawValue = watch(field.name) || "";
  const hasCustomRange = Boolean(field.minDate || field.maxDate);

  const parseConstraintDate = (value?: string) => {
    if (!value) return null;

    const parsed = value.includes("/")
      ? parse(value, "dd/MM/yyyy", new Date())
      : parseISO(value);

    return isValid(parsed) ? parsed : null;
  };

  const selectedDate = parseConstraintDate(rawValue);
  const minDate = parseConstraintDate(field.minDate);
  const maxDate = parseConstraintDate(field.maxDate);

  // Aplica máscara quando o valor muda
  useEffect(() => {
    const maskedValue = masker(unMask(rawValue), "99/99/9999");
    setDateValue(maskedValue);
  }, [rawValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = unMask(e.target.value);
    const maskedValue = masker(rawValue, "99/99/9999");
    setValue(field.name, maskedValue, { shouldValidate: false });
  };

  const handleBlur = () => {
    trigger(field.name);
  };

  // Função para o calendário popover
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, "dd/MM/yyyy");
      setValue(field.name, formattedDate, { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-2">
      {field.label && (
        <label
          htmlFor={field.name}
          className={cn(
            "block text-sm font-medium",
            field.required && "required",
          )}
        >
          {field.label}
        </label>
      )}

      <div className="relative flex items-center">
        <BaseInput
          id={field.name}
          type="text"
          inputMode="numeric"
          value={dateValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={field.placeholder || "dd/mm/aaaa"}
          error={errors[field.name]?.message as string}
          className={cn("pr-10", field.className)}
          disabled={field.disabled}
          readOnly={field.readOnly}
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 h-full px-3 py-2 hover:bg-transparent"
              disabled={field.disabled}
            >
              <CalendarIcon className="text-muted-foreground h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate ?? undefined}
              onSelect={handleDateSelect}
              disabled={(date) =>
                hasCustomRange
                  ? Boolean(
                      (minDate && date < minDate) ||
                        (maxDate && date > maxDate),
                    )
                  : date > new Date() || date < new Date("1900-01-01")
              }
              locale={ptBR}
              autoFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {field.description && !errors[field.name] && (
        <p className="text-muted-foreground text-sm">{field.description}</p>
      )}

      {/* {errors[field.name] && (
        <p className="text-destructive text-sm font-medium">
          {errors[field.name]?.message as string}
        </p>
      )} */}
    </div>
  );
}
