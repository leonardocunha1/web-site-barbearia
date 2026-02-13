"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Filter, X, Calendar, ChevronDown, ChevronUp } from "lucide-react";
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
  { value: "all", label: "Todos", color: "bg-stone-500" },
  { value: "PENDING", label: "Pendente", color: "bg-amber-500" },
  { value: "CONFIRMED", label: "Confirmado", color: "bg-emerald-500" },
  { value: "CANCELED", label: "Cancelado", color: "bg-rose-500" },
  { value: "COMPLETED", label: "Concluído", color: "bg-blue-500" },
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
      {/* Header com toggle para mobile */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Filter className="h-4 w-4 text-stone-500" />
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="bg-principal-400 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                <span className="bg-principal-600 relative inline-flex h-3 w-3 items-center justify-center rounded-full text-[10px] font-medium text-white">
                  {activeFiltersCount}
                </span>
              </span>
            )}
          </div>
          <span className="text-sm font-medium text-stone-700">Filtros</span>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 px-2 text-xs text-stone-600 hover:text-stone-900"
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

      {/* Filtros - responsivo */}
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
                {/* Status */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-stone-600">
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
                    <SelectTrigger className="h-10 border-stone-200 bg-white/50">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "h-2 w-2 rounded-full",
                                option.color,
                              )}
                            />
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Data inicial */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-stone-600">
                    Data inicial
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone-400" />
                    <Input
                      type="date"
                      value={value.startDate ?? ""}
                      onChange={(event) =>
                        onChange({ ...value, startDate: event.target.value })
                      }
                      className="h-10 border-stone-200 bg-white/50 pl-9"
                    />
                  </div>
                </div>

                {/* Data final */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-stone-600">
                    Data final
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone-400" />
                    <Input
                      type="date"
                      value={value.endDate ?? ""}
                      onChange={(event) =>
                        onChange({ ...value, endDate: event.target.value })
                      }
                      className="h-10 border-stone-200 bg-white/50 pl-9"
                    />
                  </div>
                </div>
              </div>

              {/* Botão limpar - desktop */}
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
