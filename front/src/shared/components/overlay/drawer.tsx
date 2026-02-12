"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/shared/components/ui/sheet";
import { cn } from "@/shared/utils/utils";
import type { ClassValue } from "clsx";

type DrawerProps = {
  isOpen: boolean;
  onClose: () => void; // chamado depois da animação
  title?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: ClassValue;
  overlayClassName?: ClassValue;
  removeCloseButton?: boolean;
  disableOverlayClick?: boolean;
};

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-full",
};

const ANIMATION_MS = 200;

export function Drawer({
  isOpen,
  onClose,
  title,
  footer,
  children,
  side = "right",
  size = "md",
  className,
  removeCloseButton = false,
  disableOverlayClick = false,
}: DrawerProps) {
  const [localOpen, setLocalOpen] = React.useState(isOpen);
  const closeTimeoutRef = React.useRef<number | null>(null);

  // abrir instantâneo quando pai setar true
  React.useEffect(() => {
    if (isOpen) {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
      setLocalOpen(true);
    }
  }, [isOpen]);

  React.useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setLocalOpen(true);
      return;
    }
    // começa animação de saída
    setLocalOpen(false);

    // chama onClose depois
    if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = window.setTimeout(() => {
      closeTimeoutRef.current = null;
      onClose();
    }, ANIMATION_MS);
  };

  return (
    <Sheet open={localOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side={side}
        className={cn(
          size !== "full" && sizeClasses[size],
          "transition-all duration-200 [&>button]:hidden", // esconde o botão X padrão do shadcn
          className,
        )}
        onInteractOutside={(e) => {
          if (disableOverlayClick) {
            e.preventDefault();
          }
        }}
      >
        {/* Header */}
        {(title || !removeCloseButton) && (
          <SheetHeader className="mb-4">
            <div className="flex items-center justify-between">
              {title && <SheetTitle>{title}</SheetTitle>}
              {!removeCloseButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  // ❌ não chamamos onClose direto — o Radix controla via handleOpenChange
                  onClick={() => handleOpenChange(false)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Fechar</span>
                </Button>
              )}
            </div>
          </SheetHeader>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && <SheetFooter className="mt-4">{footer}</SheetFooter>}
      </SheetContent>
    </Sheet>
  );
}

