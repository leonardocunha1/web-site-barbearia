"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useFormContext, useWatch } from "react-hook-form";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/utils/utils";
import type { BookingFormValues } from "../schemas/booking-form-schema";
import type { ListProfessionalServices200ServicesItem } from "@/api";
import { Sparkles, Clock, DollarSign } from "lucide-react";
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
            className="animate-pulse rounded-lg border border-stone-200 bg-stone-50 p-4"
          >
            <div className="flex items-start gap-3">
              <div className="h-4 w-4 rounded bg-stone-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded bg-stone-200" />
                <div className="h-3 w-1/2 rounded bg-stone-200" />
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
        className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-200 bg-stone-50/50 p-8 text-center"
      >
        <div className="rounded-full bg-stone-100 p-3">
          <Sparkles className="h-6 w-6 text-stone-400" />
        </div>
        <p className="mt-3 text-sm font-medium text-stone-600">
          Nenhum serviço disponível
        </p>
        <p className="mt-1 text-xs text-stone-500">
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-stone-700">
          Serviços
          <Sparkles className="text-principal-500 ml-2 inline h-3 w-3" />
        </Label>
        {selectedServices.length > 0 && (
          <span className="text-xs text-stone-500">
            {selectedServices.length} de {services.length} selecionados
          </span>
        )}
      </div>

      {(ruleMessage || errors.services?.message) && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          {ruleMessage || String(errors.services?.message)}
        </div>
      )}

      {/* Barra de resumo - apenas se houver serviços selecionados */}
      <AnimatePresence>
        {selectedServices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="bg-principal-50/80 flex flex-wrap items-center justify-between gap-3 overflow-hidden rounded-lg px-4 py-3 text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="text-principal-700 font-medium">
                {selectedServices.length}{" "}
                {selectedServices.length === 1
                  ? "serviço selecionado"
                  : "serviços selecionados"}
              </span>
            </div>
            <div className="flex items-center gap-4">
              {totalDuration > 0 && (
                <span className="flex items-center gap-1 text-stone-600">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDuration(totalDuration)}
                </span>
              )}
              {totalPrice > 0 && (
                <span className="flex items-center gap-1 font-medium text-stone-900">
                  <DollarSign className="text-principal-600 h-3.5 w-3.5" />
                  R$ {totalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid de serviços */}
      <div className="space-y-6">
        {groupedServices.map((group) => (
          <div key={group.type} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-stone-900">
                  {group.label}
                </span>
                <span className="text-xs text-stone-500">
                  {group.type === "ESTETICA"
                    ? "Multiplos permitidos"
                    : "Limite de 1"}
                </span>
              </div>
              <span className="text-xs text-stone-400">
                {group.services.length} Opção
                {group.services.length === 1 ? "" : "(es)"}
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
                        "group relative overflow-hidden rounded-xl border p-4 transition-all",
                        "hover:shadow-lg",
                        isSelected
                          ? "border-principal-500 from-principal-50 bg-gradient-to-br to-white shadow-md"
                          : "hover:border-principal-300 border-stone-200 bg-white hover:bg-stone-50/50",
                        isInteractive && "cursor-pointer",
                        (disabled || isBlocked) &&
                          "pointer-events-none cursor-not-allowed opacity-60",
                      )}
                      onClick={() => isInteractive && toggleService(service.id)}
                    >
                      {/* Badge de selecionado */}
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute top-3 right-3"
                        >
                          <div className="bg-principal-600 flex h-5 w-5 items-center justify-center rounded-full">
                            <Sparkles className="h-3 w-3 text-white" />
                          </div>
                        </motion.div>
                      )}

                      <div className="flex items-start gap-3">
                        {/* 🔥 CORREÇÃO: Checkbox controlado com onClick prevention */}
                        <div onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={handleCheckboxChange(service.id)}
                            disabled={disabled || isBlocked}
                            className={cn(
                              "mt-1 h-4 w-4 rounded border-2 transition-all",
                              isSelected
                                ? "border-principal-600 bg-principal-600 data-[state=checked]:bg-principal-600"
                                : "data-[state=checked]:border-principal-600 data-[state=checked]:bg-principal-600 border-stone-300",
                            )}
                          />
                        </div>

                        <div className="flex-1 space-y-1.5">
                          <p
                            className={cn(
                              "text-sm font-medium transition-colors",
                              isSelected
                                ? "text-principal-900"
                                : "text-stone-900",
                            )}
                          >
                            {service.name}
                          </p>

                          {service.category && (
                            <p className="text-xs text-stone-500">
                              {service.category}
                            </p>
                          )}

                          {isBlocked && (
                            <p className="text-xs text-amber-600">
                              Limite de 1 por tipo
                            </p>
                          )}

                          <div className="flex items-center gap-3 text-xs">
                            {service.duration && service.duration > 0 && (
                              <span className="flex items-center gap-1 text-stone-600">
                                <Clock className="h-3 w-3" />
                                {formatDuration(service.duration)}
                              </span>
                            )}

                            {service.price && service.price > 0 && (
                              <span className="text-principal-600 flex items-center gap-1 font-medium">
                                <DollarSign className="h-3 w-3" />
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
