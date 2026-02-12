"use client";

import * as React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/shared/components/ui/popover";
import { Button } from "@/shared/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/shared/utils/utils";

type PopoverProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  removeCloseButton?: boolean;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  trigger?: React.ReactNode;
};

export function PopoverComponent({
  isOpen,
  onClose,
  title,
  footer,
  children,
  className,
  removeCloseButton = false,
  side = "bottom",
  align = "center",
  trigger,
}: PopoverProps) {
  return (
    <Popover open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {trigger && <PopoverTrigger asChild>{trigger}</PopoverTrigger>}

      <PopoverContent
        side={side}
        align={align}
        className={cn(
          "z-50 w-80 rounded-md border border-gray-200 bg-white p-4 shadow-md",
          className,
        )}
      >
        {(title || !removeCloseButton) && (
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg leading-none font-semibold">{title}</h3>

            {!removeCloseButton && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onClose}
                className="h-8 w-8 p-0"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        <div className="mb-2">{children}</div>

        {footer && (
          <div className="border-t border-gray-100 pt-2">{footer}</div>
        )}

        {/* Sem PopoverArrow */}
      </PopoverContent>
    </Popover>
  );
}

