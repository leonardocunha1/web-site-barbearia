"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useFormContext, useWatch } from "react-hook-form";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/utils/utils";
import type { BookingFormValues } from "../schemas/booking-form-schema";
import type { ListProfessionalServices200ServicesItem } from "@/api";
import { Sparkles, Clock } from "lucide-react";
import { useMemo, useCallback, useState } from "react";

interface BookingServicesFieldProps {
  services: ListProfessionalServices200ServicesItem[];
  isLoading: boolean;
  disabled?: boolean;
  compact?: boolean;
  maxHeight?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25,
    },
  },
  hover: {
    y: -2,
    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 17,
    },
  },
  tap: { scale: 0.98 },
};

export function BookingServicesField({
  services,
  isLoading,
  disabled,
  compact = false,
  maxHeight = false,
}: BookingServicesFieldProps) {
  const {
    setValue,
    setError,
    clearErrors,
    formState: { errors },
    control,
  } = useFormContext<BookingFormValues>();

  const selectedRaw = useWatch({ name: "services", control });
  const selected = useMemo(() => selectedRaw ?? [], [selectedRaw]);
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  // 🔥 CORREÇÃO: Declarar estados e memos antes do useCallback
  const [ruleMessage, setRuleMessage] = useState<string | null>(null);

  const serviceTypeById = useMemo(() => {
    return new Map(
      services.map((service) => [service.id, service.type ?? "ESTETICA"]),
    );
  }, [services]);

  const selectedServices = useMemo(
    () => services.filter((service) => selectedSet.has(service.id)),
    [services, selectedSet],
  );

  const selectedTypeCount = useMemo(() => {
    const counts = new Map<string, number>();
    selectedServices.forEach((service) => {
      const type = service.type ?? "ESTETICA";
      counts.set(type, (counts.get(type) ?? 0) + 1);
    });
    return counts;
  }, [selectedServices]);

  const typeLabel = useCallback((type?: string | null) => {
    switch (type) {
      case "CORTE":
        return "Corte";
      case "BARBA":
        return "Barba";
      case "SOBRANCELHA":
        return "Sobrancelha";
      case "ESTETICA":
      default:
        return "Estetica";
    }
  }, []);

  // useCallback para evitar recriação da função
  const toggleService = useCallback(
    (serviceId: string) => {
      if (disabled) return;

      const isSelected = selectedSet.has(serviceId);
      const serviceType = serviceTypeById.get(serviceId) ?? "ESTETICA";

      if (!isSelected && serviceType !== "ESTETICA") {
        const existingCount = selectedTypeCount.get(serviceType) ?? 0;
        if (existingCount > 0) {
          const message = `Selecione apenas 1 servico do tipo ${typeLabel(serviceType)}.`;
          setRuleMessage(message);
          setError("services", { type: "validate", message });
          return;
        }
      }

      if (ruleMessage) {
        setRuleMessage(null);
        clearErrors("services");
      }

      setValue(
        "services",
        isSelected
          ? selected.filter((item) => item !== serviceId)
          : [...selected, serviceId],
        { shouldValidate: true, shouldDirty: true, shouldTouch: true },
      );
    },
    [
      clearErrors,
      disabled,
      ruleMessage,
      selected,
      selectedSet,
      selectedTypeCount,
      serviceTypeById,
      setError,
      setValue,
      typeLabel,
    ],
  );

  const totalPrice = useMemo(
    () =>
      selectedServices.reduce(
        (total, service) => total + (service.price ?? 0),
        0,
      ),
    [selectedServices],
  );

  const totalDuration = useMemo(
    () =>
      selectedServices.reduce(
        (total, service) => total + (service.duration ?? 0),
        0,
      ),
    [selectedServices],
  );

  const groupedServices = useMemo(() => {
    const groups = new Map<string, ListProfessionalServices200ServicesItem[]>();
    services.forEach((service) => {
      const type = service.type ?? "ESTETICA";
      const group = groups.get(type) ?? [];
      group.push(service);
      groups.set(type, group);
    });

    const order = ["CORTE", "BARBA", "SOBRANCELHA", "ESTETICA"];

    return order
      .map((type) => ({
        type,
        label: typeLabel(type),
        services: groups.get(type) ?? [],
      }))
      .filter((group) => group.services.length > 0);
  }, [services, typeLabel]);

  const formatDuration = useCallback((minutes: number) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;
    return remaining ? `${hours}h ${remaining}min` : `${hours}h`;
  }, []);

  const loadingSkeleton = useMemo(
    () => (
      <div className="grid gap-3 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="border-foreground/10 animate-pulse border p-4"
          >
            <div className="flex items-start gap-3">
              <div className="bg-foreground/10 h-4 w-4" />
              <div className="flex-1 space-y-2">
                <div className="bg-foreground/10 h-4 w-3/4" />
                <div className="bg-foreground/10 h-3 w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
    [],
  );

  const emptyState = useMemo(
    () => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-foreground/20 flex flex-col items-center justify-center border border-dashed p-8 text-center"
      >
        <Sparkles className="text-foreground/40 h-6 w-6" />
        <p className="text-foreground mt-3 text-sm font-medium">
          Nenhum serviço disponível
        </p>
        <p className="text-foreground/60 mt-1 text-xs">
          Este profissional ainda não possui serviços cadastrados.
        </p>
      </motion.div>
    ),
    [],
  );

  // 🔥 CORREÇÃO: Handler memoizado para o checkbox
  const handleCheckboxChange = useCallback(
    (serviceId: string) => () => {
      toggleService(serviceId);
    },
    [toggleService],
  );

  if (isLoading) {
    return loadingSkeleton;
  }

  if (services.length === 0) {
    return emptyState;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Label className="text-foreground/70 font-mono text-[10px] tracking-widest uppercase">
          Catálogo de serviços
        </Label>
        {selectedServices.length > 0 && (
          <span className="text-foreground/60 font-mono text-[10px] tracking-widest uppercase">
            {String(selectedServices.length).padStart(2, "0")} /{" "}
            {String(services.length).padStart(2, "0")} selecionado
            {selectedServices.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {(ruleMessage || errors.services?.message) && (
        <div className="border-destructive/30 bg-destructive/5 text-destructive border-l-2 px-3 py-2 text-xs">
          {ruleMessage || String(errors.services?.message)}
        </div>
      )}

      {/* Barra de resumo — apenas se houver serviços selecionados */}
      <AnimatePresence>
        {selectedServices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="border-cobre-600 bg-cobre-50/60 flex flex-wrap items-center justify-between gap-3 overflow-hidden border-l-2 px-4 py-3 text-sm"
          >
            <span className="text-foreground font-medium">
              {selectedServices.length}{" "}
              {selectedServices.length === 1
                ? "serviço selecionado"
                : "serviços selecionados"}
            </span>
            <div className="flex items-center gap-5 font-mono text-xs tracking-wider">
              {totalDuration > 0 && (
                <span className="text-foreground/70 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDuration(totalDuration)}
                </span>
              )}
              {totalPrice > 0 && (
                <span className="text-foreground flex items-center gap-1.5 font-bold">
                  R$ {totalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid de serviços por categoria */}
      <div className="space-y-7">
        {groupedServices.map((group) => (
          <div key={group.type} className="space-y-3">
            <div className="border-foreground/15 flex items-baseline justify-between border-b pb-2">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-foreground text-lg font-medium">
                  {group.label}
                </span>
                <span className="text-foreground/50 font-mono text-[10px] tracking-widest uppercase">
                  {group.type === "ESTETICA" ? "Múltiplos" : "Limite 1"}
                </span>
              </div>
              <span className="text-foreground/50 font-mono text-[10px] tracking-widest uppercase">
                {String(group.services.length).padStart(2, "0")} opç
                {group.services.length === 1 ? "ão" : "ões"}
              </span>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className={cn(
                "grid gap-3",
                compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2",
                maxHeight && "max-h-[400px] overflow-y-auto pr-2",
              )}
            >
              <AnimatePresence mode="popLayout">
                {group.services.map((service) => {
                  const isSelected = selectedSet.has(service.id);
                  const serviceType = service.type ?? "ESTETICA";
                  const isBlocked =
                    !isSelected &&
                    serviceType !== "ESTETICA" &&
                    (selectedTypeCount.get(serviceType) ?? 0) > 0;
                  const isInteractive = !disabled && !isBlocked;

                  return (
                    <motion.div
                      key={service.id}
                      variants={itemVariants}
                      whileHover={isInteractive ? "hover" : undefined}
                      whileTap={isInteractive ? "tap" : undefined}
                      layout
                      className={cn(
                        "group relative border p-4 transition-colors",
                        isSelected
                          ? "border-foreground bg-foreground/[0.03]"
                          : "border-foreground/15 hover:border-foreground/40 bg-transparent",
                        isInteractive && "cursor-pointer",
                        (disabled || isBlocked) &&
                          "pointer-events-none cursor-not-allowed opacity-50",
                      )}
                      onClick={() => isInteractive && toggleService(service.id)}
                    >
                      {/* Indicador lateral cobre quando selecionado */}
                      {isSelected && (
                        <motion.span
                          layoutId={`indicator-${service.id}`}
                          className="bg-cobre-600 absolute inset-y-0 left-0 w-1"
                          aria-hidden
                        />
                      )}

                      <div className="flex items-start gap-3">
                        <div onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={handleCheckboxChange(service.id)}
                            disabled={disabled || isBlocked}
                            className={cn(
                              "mt-1 h-4 w-4 transition-all",
                              "data-[state=checked]:border-foreground data-[state=checked]:bg-foreground data-[state=checked]:text-background",
                            )}
                          />
                        </div>

                        <div className="flex-1 space-y-1.5">
                          <p className="text-foreground text-sm font-medium">
                            {service.name}
                          </p>

                          {service.category && (
                            <p className="text-foreground/60 text-xs">
                              {service.category}
                            </p>
                          )}

                          {isBlocked && (
                            <p className="text-destructive font-mono text-[10px] tracking-widest uppercase">
                              Limite atingido
                            </p>
                          )}

                          <div className="flex items-center gap-3 pt-1 font-mono text-[11px] tracking-wider">
                            {service.duration && service.duration > 0 && (
                              <span className="text-foreground/60 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDuration(service.duration)}
                              </span>
                            )}

                            {service.price && service.price > 0 && (
                              <span className="text-foreground font-bold">
                                R$ {service.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {!ruleMessage && errors.services && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-destructive text-sm font-medium"
          >
            {errors.services.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
