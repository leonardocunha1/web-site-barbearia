"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogProps,
} from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ModalSize = "full" | "semi-full" | "xl" | "lg" | "md" | "sm" | "xs";

type ModalProps = DialogProps & {
  title?: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  classNames?: {
    content?: string;
    header?: string;
    footer?: string;
  };
  removeCloseButton?: boolean;
  hideOverlay?: boolean;
};

const sizeClasses: Record<ModalSize, string> = {
  full: "w-full h-full max-w-none",
  "semi-full": "w-full h-5/6 max-w-none",
  xl: "sm:w-[90vw] sm:max-w-[1200px]",
  lg: "sm:w-[80vw] sm:max-w-[1000px]",
  md: "sm:w-[70vw] sm:max-w-[800px]",
  sm: "sm:w-[60vw] sm:max-w-[600px]",
  xs: "sm:w-[50vw] sm:max-w-[400px]",
};

export function Modal({
  open,
  onOpenChange,
  title,
  footer,
  children,
  size = "md",
  classNames,
  removeCloseButton = false,
  ...props
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} {...props}>
      <DialogContent
        className={cn(
          "bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200 sm:rounded-lg",
          "max-h-[90vh] overflow-y-auto",
          sizeClasses[size],
          classNames?.content,
        )}
      >
        {(title || !removeCloseButton) && (
          <div
            className={cn(
              "flex items-center justify-between border-b pb-4",
              classNames?.header,
            )}
          >
            {title && (
              <DialogTitle className="text-lg leading-none font-medium">
                {title}
              </DialogTitle>
            )}
            {!removeCloseButton && (
              <DialogClose asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Fechar</span>
                </Button>
              </DialogClose>
            )}
          </div>
        )}

        {/* Conteúdo */}
        <div>{children}</div>

        {/* Footer */}
        {footer && (
          <div
            className={cn(
              "flex justify-end space-x-2 border-t pt-4",
              classNames?.footer,
            )}
          >
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
