"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  removeCloseButton?: boolean;
  children: React.ReactNode;
  className?: string;
};

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-none w-full h-full",
};

export function Modal({
  isOpen,
  onClose,
  title,
  footer,
  children,
  size = "md",
  removeCloseButton = false,
  className,
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn(
          sizeClasses[size],
          className,
          size === "full" && "h-screen rounded-none"
        )}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        {(title || !removeCloseButton) && (
          <DialogHeader>
            <div className="flex items-center justify-between">
              {title && <DialogTitle>{title}</DialogTitle>}
              {!removeCloseButton && (
                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={onClose}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Fechar</span>
                  </Button>
                </DialogClose>
              )}
            </div>
          </DialogHeader>
        )}

        <div className="py-4">{children}</div>

        {footer && (
          <div className="flex justify-end space-x-2 border-t pt-4">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}