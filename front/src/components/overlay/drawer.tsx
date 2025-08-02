"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { ClassValue } from "clsx"; // ⬅️ importante

type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
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
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side={side}
        className={cn(size !== "full" && sizeClasses[size], className)}
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
              <SheetTitle>{title}</SheetTitle>
              {!removeCloseButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0"
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
