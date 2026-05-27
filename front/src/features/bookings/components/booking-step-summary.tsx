"use client";

import { useFormContext } from "react-hook-form";
import {
  useListProfessionalServices,
  useListOrSearchProfessionals,
  GetBonusBalance200,
  usePreviewBookingPrice,
} from "@/api";
import { BookingFormValues } from "../schemas/booking-form-schema";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  SparkleIcon,
  CalendarIcon,
  ClockIcon,
  UserCircleIcon,
  ScissorsIcon,
} from "@phosphor-icons/react";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMemo, useEffect, useRef } from "react";
import { useUser } from "@/contexts/user";
import { useProfessionalSchedule } from "../hooks/use-professional-schedule";
import { BookingStepHeader } from "./booking-step-header";

interface BookingStepSummaryProps {
  bonusBalance?: GetBonusBalance200;
}

export function BookingStepSummary({ bonusBalance }: BookingStepSummaryProps) {
  const {
    watch,
    setValue,
    register,
    formState: { errors },
  } = useFormContext<BookingFormValues>();

  const { user } = useUser();

  const professionalId = watch("professionalId");
  const selectedServicesValue = watch("services");
  const selectedServices = useMemo(
    () => selectedServicesValue ?? [],
    [selectedServicesValue],
  );
  const selectedDate = watch("date");
  const selectedTime = watch("time");
  const useBonusPoints = watch("useBonusPoints");
  const couponCode = watch("couponCode") ?? "";

  const professionalsQuery = useListOrSearchProfessionals({
    page: 1,
    limit: 100,
    status: "active",
  });

  const scheduleQuery = useProfessionalSchedule({
    professionalId,
    date: selectedDate,
    serviceIds: selectedServices,
  });

  const isHoliday = Boolean(scheduleQuery.data?.isHoliday);
  const holidayReason = scheduleQuery.data?.holidayReason;

  const servicesQuery = useListProfessionalServices(
    professionalId,
    { page: 1, limit: 100, activeOnly: true },
    {
      query: {
        enabled: Boolean(professionalId),
      },
    },
  );

  const professional = professionalsQuery.data?.professionals?.find(
    (p) => p.id === professionalId,
  );

  const selectedServicesDetails = useMemo(() => {
    const services = servicesQuery.data?.services ?? [];
    return selectedServices
      .map((serviceId) => services.find((s) => s.id === serviceId))
      .filter(Boolean);
  }, [servicesQuery.data?.services, selectedServices]);

  const totalPrice = useMemo(() => {
    return selectedServicesDetails.reduce(
      (total, service) => total + (service?.price ?? 0),
      0,
    );
  }, [selectedServicesDetails]);

  const sortedServices = useMemo(
    () => [...selectedServices].sort(),
    [selectedServices],
  );

  const previewMutation = usePreviewBookingPrice();
  const lastPreviewParamsRef = useRef<string>("");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const shouldFetchPreview = Boolean(
    user && professionalId && sortedServices.length > 0,
  );

  useEffect(() => {
    if (!shouldFetchPreview) return;

    const newParams = JSON.stringify({
      professionalId,
      services: sortedServices,
      useBonusPoints: Boolean(useBonusPoints),
      couponCode: couponCode || undefined,
    });

    if (newParams === lastPreviewParamsRef.current) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      lastPreviewParamsRef.current = newParams;

      previewMutation.mutate({
        data: {
          professionalId,
          services: sortedServices.map((serviceId) => ({ serviceId })),
          useBonusPoints: Boolean(useBonusPoints),
          couponCode: couponCode || undefined,
        },
      });
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    professionalId,
    sortedServices,
    useBonusPoints,
    couponCode,
    shouldFetchPreview,
  ]);

  const pricePreview = previewMutation.data;
  const subtotalValue = pricePreview?.totalValue ?? totalPrice;
  const couponDiscount = pricePreview?.couponDiscount ?? 0;
  const pointsDiscount = pricePreview?.pointsDiscount ?? 0;
  const pointsUsed = pricePreview?.pointsUsed ?? 0;
  const finalValue = pricePreview?.finalValue ?? totalPrice;
  const previewErrorMessage =
    previewMutation.isError && previewMutation.error
      ? (previewMutation.error as { message?: string }).message
      : null;

  const formattedDate = useMemo(() => {
    if (!selectedDate) return "";
    try {
      const date = parse(selectedDate, "yyyy-MM-dd", new Date());
      return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch {
      return selectedDate;
    }
  }, [selectedDate]);

  const pointValue = useMemo(() => {
    if (!bonusBalance?.points.totalPoints) return null;
    if (!bonusBalance.monetaryValue.totalValue) return null;
    return (
      bonusBalance.monetaryValue.totalValue / bonusBalance.points.totalPoints
    );
  }, [bonusBalance]);

  const hasEnoughPoints =
    bonusBalance && bonusBalance.points.totalPoints >= 100;

  const preventSubmit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="space-y-8">
      <BookingStepHeader
        step="04"
        title="Confirme sua"
        highlight="reserva"
        description="Revise os detalhes e finalize o agendamento."
      />

      {/* Resumo editorial */}
      <section className="border-foreground border p-6">
        <div className="border-foreground/15 mb-4 flex items-baseline justify-between border-b pb-3">
          <span className="text-foreground/70 font-mono text-[10px] tracking-widest uppercase">
            Resumo · El Bigodón
          </span>
          <span className="text-foreground/50 font-mono text-[10px] tracking-widest uppercase">
            N° rascunho
          </span>
        </div>

        <dl className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <UserCircleIcon
              weight="duotone"
              className="text-cobre-700 h-4 w-4 shrink-0"
            />
            <dt className="text-foreground/60 font-mono text-[10px] tracking-widest uppercase w-24 shrink-0">
              Profissional
            </dt>
            <dd className="text-foreground font-medium">
              {professional?.user.name ?? "—"}
            </dd>
          </div>

          <div className="flex items-center gap-3">
            <CalendarIcon
              weight="duotone"
              className="text-cobre-700 h-4 w-4 shrink-0"
            />
            <dt className="text-foreground/60 font-mono text-[10px] tracking-widest uppercase w-24 shrink-0">
              Data
            </dt>
            <dd className="text-foreground font-medium">{formattedDate || "—"}</dd>
          </div>

          <div className="flex items-center gap-3">
            <ClockIcon
              weight="duotone"
              className="text-cobre-700 h-4 w-4 shrink-0"
            />
            <dt className="text-foreground/60 font-mono text-[10px] tracking-widest uppercase w-24 shrink-0">
              Horário
            </dt>
            <dd className="text-foreground font-mono font-bold">
              {selectedTime || "—"}
            </dd>
          </div>

          {isHoliday && (
            <div className="border-destructive/30 bg-destructive/5 text-destructive border-l-2 px-3 py-2 text-xs">
              <p className="font-medium">Dia indisponível (feriado).</p>
              {holidayReason && (
                <p className="text-destructive/80 mt-1">Motivo: {holidayReason}</p>
              )}
            </div>
          )}
        </dl>

        {/* Serviços */}
        <div className="border-foreground/15 mt-5 border-t pt-4">
          <div className="mb-2 flex items-center gap-2">
            <ScissorsIcon
              weight="duotone"
              className="text-cobre-700 h-4 w-4"
            />
            <span className="text-foreground/60 font-mono text-[10px] tracking-widest uppercase">
              Serviços
            </span>
          </div>
          <ul className="space-y-1.5 text-sm">
            {selectedServicesDetails.map((service) => (
              <li
                key={service?.id}
                className="text-foreground flex items-center justify-between"
              >
                <span>{service?.name}</span>
                <span className="font-mono">
                  R$ {(service?.price ?? 0).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Totais */}
        <div className="border-foreground/15 mt-5 space-y-1.5 border-t pt-4 text-sm">
          <div className="text-foreground/70 flex justify-between">
            <span>Subtotal</span>
            <span className="font-mono">R$ {subtotalValue.toFixed(2)}</span>
          </div>

          {couponDiscount > 0 && (
            <div className="text-cobre-700 flex justify-between">
              <span>Desconto do cupom</span>
              <span className="font-mono">- R$ {couponDiscount.toFixed(2)}</span>
            </div>
          )}

          {pointsDiscount > 0 && (
            <div className="text-cobre-700 flex justify-between">
              <span>
                Pontos{pointsUsed > 0 ? ` (${pointsUsed})` : ""}
              </span>
              <span className="font-mono">- R$ {pointsDiscount.toFixed(2)}</span>
            </div>
          )}

          <div className="border-foreground/15 mt-2 flex items-baseline justify-between border-t pt-3">
            <span className="font-mono text-[10px] tracking-widest uppercase">
              Total
            </span>
            <span className="font-display text-foreground text-2xl font-medium">
              {previewMutation.isPending
                ? "···"
                : `R$ ${finalValue.toFixed(2)}`}
            </span>
          </div>
        </div>
      </section>

      {/* Cupom + pontos */}
      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-2">
          <Label
            htmlFor="couponCode"
            className="text-foreground/70 font-mono text-[10px] tracking-widest uppercase"
          >
            Cupom de desconto
          </Label>
          <Input
            id="couponCode"
            {...register("couponCode")}
            placeholder="Digite o código"
            disabled={Boolean(useBonusPoints)}
            onKeyDown={preventSubmit}
          />
          {useBonusPoints && (
            <p className="text-foreground/60 text-xs">
              Para usar cupom, desative os pontos bônus.
            </p>
          )}
          {errors.couponCode && (
            <p className="text-destructive text-sm font-medium">
              {errors.couponCode.message}
            </p>
          )}
        </div>

        {bonusBalance && (
          <div className="border-cobre-600 border-l-2 px-4 py-3 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-foreground/70 font-mono text-[10px] tracking-widest uppercase">
                  Pontos bônus
                </p>
                <p className="text-foreground mt-1 text-sm">
                  Você tem{" "}
                  <span className="text-cobre-700 font-mono font-bold">
                    {bonusBalance.points.totalPoints}
                  </span>{" "}
                  pontos
                  {bonusBalance.monetaryValue.totalValue > 0 && (
                    <span className="text-foreground/60">
                      {" "}
                      (R$ {bonusBalance.monetaryValue.totalValue.toFixed(2)})
                    </span>
                  )}
                </p>
                {pointValue && (
                  <p className="text-foreground/60 mt-1 text-xs">
                    1 ponto = R$ {pointValue.toFixed(2)}
                  </p>
                )}
              </div>
              <SparkleIcon
                weight="duotone"
                className="text-cobre-600 h-5 w-5"
              />
            </div>

            {hasEnoughPoints ? (
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={Boolean(useBonusPoints)}
                  onCheckedChange={(value) => {
                    const isChecked = Boolean(value);
                    setValue("useBonusPoints", isChecked, {
                      shouldValidate: true,
                    });

                    if (!isChecked) {
                      setValue("couponCode", "", { shouldValidate: false });
                    }
                  }}
                  className="data-[state=checked]:bg-foreground data-[state=checked]:border-foreground data-[state=checked]:text-background"
                />
                <Label className="text-foreground cursor-pointer text-sm">
                  Usar meus pontos
                </Label>
              </div>
            ) : (
              <p className="text-foreground/60 text-xs">
                Mínimo de 100 pontos para uso.
              </p>
            )}
          </div>
        )}
      </div>

      {previewErrorMessage && (
        <p className="text-destructive text-sm font-medium">
          {previewErrorMessage}
        </p>
      )}

      {/* Observações */}
      <div className="space-y-2">
        <Label
          htmlFor="notes"
          className="text-foreground/70 font-mono text-[10px] tracking-widest uppercase"
        >
          Observações (opcional)
        </Label>
        <Textarea
          id="notes"
          rows={3}
          {...register("notes")}
          placeholder="Alguma informação adicional para o profissional?"
          onKeyDown={preventSubmit}
          className="resize-none"
        />
        {errors.notes && (
          <p className="text-destructive text-sm font-medium">
            {errors.notes.message}
          </p>
        )}
      </div>
    </div>
  );
}
