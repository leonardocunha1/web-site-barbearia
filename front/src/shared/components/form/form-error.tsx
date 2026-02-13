"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { cn } from "@/shared/utils/utils";

interface FormErrorProps {
  message?: string;
  className?: string;
  icon?: boolean;
}

export function FormError({ message, className, icon = true }: FormErrorProps) {
  if (!message) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: -10, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, y: -10, height: 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "flex items-center gap-1.5 overflow-hidden text-xs",
          "text-destructive",
          className,
        )}
      >
        {icon && <AlertCircle className="h-3.5 w-3.5 shrink-0" />}
        <span className="font-medium">{message}</span>
      </motion.div>
    </AnimatePresence>
  );
}
