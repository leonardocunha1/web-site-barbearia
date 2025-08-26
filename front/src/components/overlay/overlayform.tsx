"use client";

import { DynamicForm } from "../form/DynamicForm";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DynamicFormProps } from "../form/types";
import { z } from "zod";

type OverlayFormProps<T extends z.ZodTypeAny> = DynamicFormProps<T> & {
  title?: React.ReactNode;
  onClose?: () => void;
  footer?: React.ReactNode;
  removeCloseButton?: boolean;
  containerClassName?: string;
};

export function OverlayForm<T extends z.ZodTypeAny>({
  title,
  onClose,
  footer,
  removeCloseButton = false,
  containerClassName,
  ...formProps
}: OverlayFormProps<T>) {
  return (
    <div className={cn("flex h-full flex-col", containerClassName)}>
      {/* Header */}
      {title && (
        <div className="mb-4 flex items-center justify-between border-b pb-4">
          <h3 className="text-lg font-medium">{title}</h3>
          {!removeCloseButton && onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="size-4" />
              <span className="sr-only">Fechar</span>
            </Button>
          )}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <DynamicForm<T>
          {...formProps}
          onSuccess={() => {
            formProps.onSuccess?.();
            onClose?.();
          }}
        />
      </div>

      {footer && <div className="mt-4 border-t pt-4">{footer}</div>}
    </div>
  );
}
