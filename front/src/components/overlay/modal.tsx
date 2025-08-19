"use client";

import React, { useEffect, useRef, useState } from "react";
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
import { ClassValue } from "clsx";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  removeCloseButton?: boolean;
  children: React.ReactNode;
  className?: ClassValue;
};

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-none w-full h-full",
};

const ANIMATION_MS = 200;

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
  const [localOpen, setLocalOpen] = useState(isOpen);
  const closeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
      setLocalOpen(true);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setLocalOpen(false);
      closeTimeoutRef.current = window.setTimeout(() => {
        closeTimeoutRef.current = null;
        onClose(); // chamado DEPOIS da animação
      }, ANIMATION_MS);
    }
  };

  return (
    <Dialog open={localOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          sizeClasses[size],
          "overflow-hidden rounded-xl border border-gray-200 bg-white p-0 shadow-lg transition-all duration-200",
          "data-[state=closed]:animate-[var(--animate-fade-out)] data-[state=open]:animate-[var(--animate-fade-in)]",
          "data-[state=closed]:animate-[var(--animate-zoom-out-95)] data-[state=open]:animate-[var(--animate-zoom-in-95)]",
          size === "full" && "h-screen rounded-none",
          className,
        )}
      >
        {(title || !removeCloseButton) && (
          <DialogHeader className="bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between">
              {title && (
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  {title}
                </DialogTitle>
              )}
              {!removeCloseButton && (
                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-gray-200"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Fechar</span>
                  </Button>
                </DialogClose>
              )}
            </div>
          </DialogHeader>
        )}

        <div className="px-6 py-4 text-gray-700">{children}</div>

        {footer && (
          <div className="flex justify-end space-x-2 border-t bg-gray-50 px-6 py-4">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
