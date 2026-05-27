"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { DatePicker } from "@/shared/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/shared/utils/utils";

export type BookingFilterValues = {
  status?: string;
  startDate?: string;
  endDate?: string;
};

type BookingFiltersProps = {
  value: BookingFilterValues;
  onChange: (value: BookingFilterValues) => void;
  className?: string;
};

const statusOptions = [
  { value: "all", label: "Todos", color: "bg-foreground/40" },
  { value: "PENDING", label: "Pendente", color: "bg-cobre-500" },
  { value: "CONFIRMED", label: "Confirmado", color: "bg-emerald-600" },
  { value: "CANCELED", label: "Cancelado", color: "bg-destructive" },
  { value: "COMPLETED", label: "Concluído", color: "bg-foreground" },
];

export function BookingFilters({
  value,
  onChange,
  className,
}: BookingFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters = Boolean(
    (value.status && value.status !== "all") ||
      value.startDate ||
      value.endDate,
  );

  const activeFiltersCount = [
    value.status && value.status !== "all",
    value.startDate,
    value.endDate,
  ].filter(Boolean).length;

  const handleClear = () => {
    onChange({ status: "", startDate: "", endDate: "" });
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Filter className="text-foreground/70 h-4 w-4" />
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="bg-cobre-500 absolute inline-flex h-full w-full animate-ping opacity-75" />
                <span className="bg-cobre-600 text-background relative inline-flex h-3 w-3 items-center justify-center text-[10px] font-medium">
                  {activeFiltersCount}
                </span>
              </span>
            )}
          </div>
          <span className="text-foreground/70 font-mono text-[10px] tracking-widest uppercase">
            Filtros
          </span>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-foreground/60 hover:text-foreground h-8 px-2 font-mono text-[10px] tracking-widest uppercase"
            >
              <X className="mr-1 h-3 w-3" />
              Limpar
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 px-2 lg:hidden"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {(isExpanded ||
          (typeof window !== "undefined" && window.innerWidth >= 1024)) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden lg:block"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
              <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-foreground/70 font-mono text-[10px] tracking-widest uppercase">
                    Status
                  </Label>
                  <Select
                    value={value.status ?? "all"}
                    onValueChange={(status) =>
                      onChange({
                        ...value,
                        status: status === "all" ? "" : status,
                      })
                    }
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <span className={cn("h-2 w-2", option.color)} />
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground/70 font-mono text-[10px] tracking-widest uppercase">
                    Data inicial
                  </Label>
                  <DatePicker
                    value={value.startDate ?? ""}
                    max={value.endDate || undefined}
                    onChange={(date) => onChange({ ...value, startDate: date })}
                    placeholder="Selecione a data inicial"
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground/70 font-mono text-[10px] tracking-widest uppercase">
                    Data final
                  </Label>
                  <DatePicker
                    value={value.endDate ?? ""}
                    min={value.startDate || undefined}
                    onChange={(date) => onChange({ ...value, endDate: date })}
                    placeholder="Selecione a data final"
                    className="h-10"
                  />
                </div>
              </div>

              <Button
                variant="outline"
                onClick={handleClear}
                disabled={!hasActiveFilters}
                className="hidden h-10 shrink-0 lg:inline-flex"
              >
                <X className="mr-2 h-4 w-4" />
                Limpar filtros
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
