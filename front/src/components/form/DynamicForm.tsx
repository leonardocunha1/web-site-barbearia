"use client";

import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, DynamicFormProps } from "./types";
import { Button } from "../ui/button";
import { TextInput } from "./fields/TextInput";
import { cn } from "@/lib/utils";
import { assertNever } from "@/utils/assert";
import { z } from "zod";
import { SelectInput } from "./fields/SelectInput";
import { PhoneInput } from "./fields/PhoneInput";
import { NumberInput } from "./fields/NumberInput";
import { CurrencyInputComponent } from "./fields/CurrencyInput";
import { CheckboxInput } from "./fields/CheckBoxInput";
import { TextareaInput } from "./fields/TextareaInput";
import { CpfInput } from "./fields/CpfInput";
import { DateInput } from "./fields/DateInput";

export function DynamicForm<T extends z.ZodTypeAny>({
  fields = [],
  onSubmit,
  schema,
  children,
  className = "",
  resetAfterSubmit = false,
  gridColumns,
  gridRows,
  button,
  defaultButton = true,
  buttonClassName = "",
}: DynamicFormProps<T>) {
  const methods = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
  });

  const { handleSubmit, reset, formState } = methods;

  const onFormSubmit: SubmitHandler<z.infer<T>> = async (data) => {
    await onSubmit(data);
    if (resetAfterSubmit) {
      reset();
    }
  };

  const gridStyle =
    gridColumns || gridRows
      ? {
          display: "grid",
          gridTemplateColumns: gridColumns
            ? `repeat(${gridColumns}, 1fr)`
            : undefined,
          gridTemplateRows: gridRows ? `repeat(${gridRows}, auto)` : undefined,
          gap: "1rem",
        }
      : undefined;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className={cn("space-y-4", className)}
        style={gridStyle}
      >
        {fields.map((field) => (
          <div
            key={field.name}
            style={{
              gridColumn: field.gridColumn,
              gridRow: field.gridRow,
            }}
          >
            <FormFieldRenderer field={field} />
          </div>
        ))}

        {children}

        {(defaultButton || button) && (
          <div className="pt-4" style={{ gridColumn: "1 / -1" }}>
            {button || (
              <Button
                type="submit"
                className={cn("w-full", buttonClassName)}
                disabled={formState.isSubmitting}
              >
                {formState.isSubmitting ? "Enviando..." : "Enviar"}
              </Button>
            )}
          </div>
        )}
      </form>
    </FormProvider>
  );
}

function FormFieldRenderer({ field }: { field: FormField }) {
  switch (field.type) {
    case "text":
    case "email":
    case "password":
      return <TextInput field={field} />;
    case "number":
      return <NumberInput field={field} />;
    case "date":
      return <DateInput field={field} />;
    case "select":
      return <SelectInput field={field} />;
    case "checkbox":
      return <CheckboxInput field={field} />;
    case "textarea":
      return <TextareaInput field={field} />;
    case "cpf":
      return <CpfInput field={field} />;
    case "phone":
      return <PhoneInput field={field} />;
    case "currency":
      return <CurrencyInputComponent field={field} />;
    default: {
      return assertNever(field);
    }
  }
}
