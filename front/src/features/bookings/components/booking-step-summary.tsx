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
import { Sparkles, Calendar, Clock, User, Scissors } from "lucide-react";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMemo, useEffect, useRef } from "react";
import { useUser } from "@/contexts/user";

interface BookingStepSummaryProps {
  bonusBalance?: GetBonusBalance200;
}

export function BookingStepSummary({ bonusBalance }: BookingStepSummaryProps) {
  console.log("[BookingStepSummary] Renderizando");

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

  // Chamar preview quando os dados mudarem (com debounce para evitar múltiplas chamadas)
  useEffect(() => {
    if (!shouldFetchPreview) return;

    const newParams = JSON.stringify({
      professionalId,
      services: sortedServices,
      useBonusPoints: Boolean(useBonusPoints),
      couponCode: couponCode || undefined,
    });

    // Evitar chamadas desnecessárias comparando os params
    if (newParams === lastPreviewParamsRef.current) return;

    // Limpar debounce anterior
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Definir novo debounce (300ms)
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

    // Cleanup do debounce ao desmontar
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
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-stone-900">
          Confirme seu agendamento
        </h3>
        <p className="text-muted-foreground mt-2">
          Revise os detalhes e finalize sua reserva
        </p>
      </div>

      {/* Resumo do agendamento */}
      <div className="space-y-4 rounded-lg border border-stone-200 bg-stone-50 p-6">
        <h4 className="font-semibold text-stone-900">
          Detalhes do agendamento
        </h4>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <User className="text-principal-600 h-4 w-4" />
            <span className="text-muted-foreground">Profissional:</span>
            <span className="font-medium text-stone-900">
              {professional?.user.name}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Calendar className="text-principal-600 h-4 w-4" />
            <span className="text-muted-foreground">Data:</span>
            <span className="font-medium text-stone-900">{formattedDate}</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Clock className="text-principal-600 h-4 w-4" />
            <span className="text-muted-foreground">Horário:</span>
            <span className="font-medium text-stone-900">{selectedTime}</span>
          </div>

          <div className="border-t border-stone-200 pt-2">
            <div className="flex items-start gap-3 text-sm">
              <Scissors className="text-principal-600 mt-0.5 h-4 w-4" />
              <div className="flex-1">
                <span className="text-muted-foreground mb-2 block">
                  Serviços:
                </span>
                <ul className="space-y-1">
                  {selectedServicesDetails.map((service) => (
                    <li
                      key={service?.id}
                      className="flex justify-between text-stone-900"
                    >
                      <span>{service?.name}</span>
                      <span className="font-medium">
                        R$ {(service?.price ?? 0).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-1 border-t border-stone-200 pt-2 text-sm">
            <div className="flex justify-between text-stone-700">
              <span>Subtotal:</span>
              <span>R$ {subtotalValue.toFixed(2)}</span>
            </div>

            {couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Desconto do cupom:</span>
                <span>- R$ {couponDiscount.toFixed(2)}</span>
              </div>
            )}

            {pointsDiscount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>
                  Desconto com pontos{pointsUsed > 0 ? ` (${pointsUsed})` : ""}:
                </span>
                <span>- R$ {pointsDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-base font-semibold">
              <span>Total final:</span>
              <span className="text-principal-600">
                {previewMutation.isPending
                  ? "Calculando..."
                  : `R$ ${finalValue.toFixed(2)}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        {/* Cupom de desconto */}
        <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
          <Label htmlFor="couponCode" className="text-stone-700">
            Cupom de desconto (opcional)
          </Label>
          <Input
            id="couponCode"
            {...register("couponCode")}
            placeholder="Digite o código do cupom"
            disabled={Boolean(useBonusPoints)}
            onKeyDown={preventSubmit}
            className="focus:border-principal-400 focus:ring-principal-200 mt-2 border-stone-200 transition-all"
          />
          {useBonusPoints && (
            <p className="text-muted-foreground mt-2 text-xs">
              Para usar pontos, o cupom precisa ficar desativado.
            </p>
          )}
          {errors.couponCode && (
            <p className="text-destructive mt-2 text-sm font-medium">
              {errors.couponCode.message}
            </p>
          )}
        </div>

        {/* Pontos de bônus */}
        {bonusBalance && (
          <div className="border-principal-200 bg-principal-50 space-y-3 rounded-xl border p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-stone-900">
                  Seus pontos de bônus
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Você tem{" "}
                  <span className="text-principal-700 font-semibold">
                    {bonusBalance.points.totalPoints} pontos
                  </span>{" "}
                  disponíveis
                  {bonusBalance.monetaryValue.totalValue > 0 && (
                    <span>
                      {" "}
                      (R$ {bonusBalance.monetaryValue.totalValue.toFixed(2)})
                    </span>
                  )}
                </p>
                {pointValue && (
                  <p className="text-muted-foreground mt-1 text-xs">
                    Cada ponto equivale a R$ {pointValue.toFixed(2)}.
                  </p>
                )}
              </div>
              <Sparkles className="text-principal-500 h-6 w-6" />
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
                  className="border-principal-300 data-[state=checked]:bg-principal-600 data-[state=checked]:border-principal-600"
                />
                <Label className="cursor-pointer text-sm text-stone-700">
                  Usar meus pontos neste agendamento
                </Label>
              </div>
            ) : (
              <p className="text-xs text-amber-700">
                Você precisa de pelo menos 100 pontos para utilizar no
                agendamento.
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
        <Label htmlFor="notes" className="text-stone-700">
          Observações (opcional)
        </Label>
        <Textarea
          id="notes"
          rows={3}
          {...register("notes")}
          placeholder="Alguma informação adicional para o profissional?"
          onKeyDown={preventSubmit}
          className="focus:border-principal-400 focus:ring-principal-200 resize-none border-stone-200 transition-all"
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
