"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  CalendarIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ReceiptIcon,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { useGetProfessionalDashboard } from "@/api";
import { formatBookingDateTime } from "@/features/bookings/utils/booking-formatters";
import { RecentServices } from "./recent-services";
import { Label } from "@/shared/components/ui/label";
import { DatePicker } from "@/shared/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LoadingState } from "@/shared/components/ui/loading-state";
import { ErrorState } from "@/shared/components/ui/error-state";

const formatCurrency = (value?: number | null) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value ?? 0);

const rangeOptions = [
  { value: "today", label: "Hoje" },
  { value: "week", label: "Semana" },
  { value: "month", label: "Mês" },
  { value: "custom", label: "Personalizado" },
] as const;

const formatToday = () => {
  const now = new Date();
  return now.toISOString().slice(0, 10);
};

const labelClass =
  "text-foreground/70 font-mono text-[10px] tracking-widest uppercase";

type KpiCardProps = {
  label: string;
  Icon: Icon;
  value: React.ReactNode;
  hint?: React.ReactNode;
  span?: "default" | "wide";
};

function KpiCard({ label, Icon, value, hint, span = "default" }: KpiCardProps) {
  return (
    <Card className={span === "wide" ? "col-span-full lg:col-span-2" : ""}>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <CardTitle className={labelClass}>{label}</CardTitle>
        <Icon weight="duotone" className="text-cobre-700 h-5 w-5" />
      </CardHeader>
      <CardContent>
        <div className="font-display text-foreground text-3xl leading-tight font-medium tracking-tight">
          {value}
        </div>
        {hint && (
          <p className="text-foreground/60 mt-1 text-xs">{hint}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function OverviewSection() {
  const [range, setRange] = useState<"today" | "week" | "month" | "custom">(
    "today",
  );
  const [startDate, setStartDate] = useState<string>(formatToday());
  const [endDate, setEndDate] = useState<string>(formatToday());

  const params = useMemo(
    () =>
      range === "custom"
        ? {
            range,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
          }
        : { range },
    [range, startDate, endDate],
  );

  const isCustomReady =
    range !== "custom" || (Boolean(startDate) && Boolean(endDate));

  const { data, isLoading, isError } = useGetProfessionalDashboard(params, {
    query: { enabled: isCustomReady, refetchInterval: 30000 },
  });

  const metrics = data?.metrics;
  const nextAppointment = data?.nextAppointments?.[0];
  const nextDateTime = formatBookingDateTime(nextAppointment?.date);
  const rangeLabel =
    rangeOptions.find((option) => option.value === range)?.label ?? "Hoje";

  return (
    <div className="space-y-6">
      {/* Filtro de período editorial */}
      <div className="border-foreground/15 flex flex-col gap-4 border-l-2 px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className={labelClass}>Período do dashboard</p>
          <p className="text-foreground/60 text-xs">
            Ajuste o intervalo para atualizar os indicadores.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <Label className={labelClass}>Período</Label>
            <Select
              value={range}
              onValueChange={(value: "today" | "week" | "month" | "custom") =>
                setRange(value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {rangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {range === "custom" && (
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="space-y-2">
                <Label className={labelClass}>Início</Label>
                <DatePicker
                  value={startDate}
                  max={endDate || undefined}
                  onChange={setStartDate}
                  placeholder="Data inicial"
                />
              </div>
              <div className="space-y-2">
                <Label className={labelClass}>Fim</Label>
                <DatePicker
                  value={endDate}
                  min={startDate || undefined}
                  onChange={setEndDate}
                  placeholder="Data final"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid de KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <CardTitle className={labelClass}>Próximo agendamento</CardTitle>
            <CalendarIcon weight="duotone" className="text-cobre-700 h-5 w-5" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingState message="Carregando..." size="sm" />
            ) : isError ? (
              <ErrorState type="error" message="Erro ao carregar" />
            ) : nextAppointment ? (
              <>
                <div className="font-display text-foreground text-2xl leading-tight font-medium tracking-tight">
                  {nextDateTime.date} · {nextDateTime.time}
                </div>
                <p className="text-foreground/60 mt-1 text-xs">
                  {nextAppointment.clientName} — {nextAppointment.service}
                </p>
              </>
            ) : (
              <div className="text-foreground/60 text-sm">
                Sem agendamentos
              </div>
            )}
          </CardContent>
        </Card>

        <KpiCard
          label={`Faturamento · ${rangeLabel}`}
          Icon={CurrencyDollarIcon}
          value={formatCurrency(metrics?.earnings)}
          hint={`${metrics?.appointments ?? 0} agendamentos no período`}
        />

        <KpiCard
          label="Clientes atendidos"
          Icon={CheckCircleIcon}
          value={String(metrics?.completed ?? 0).padStart(2, "0")}
          hint="atendimentos concluídos"
        />

        <KpiCard
          label="Cancelamentos"
          Icon={XCircleIcon}
          value={String(metrics?.canceled ?? 0).padStart(2, "0")}
          hint="no período"
        />

        <KpiCard
          label="Pendentes"
          Icon={ClockIcon}
          value={String(metrics?.pendingCount ?? 0).padStart(2, "0")}
          hint="aguardando confirmação"
        />

        <KpiCard
          label="Taxa conclusão"
          Icon={CheckCircleIcon}
          value={`${(metrics?.completionRate ?? 0).toFixed(1)}%`}
          hint="agendamentos concluídos"
        />

        <KpiCard
          label="Taxa cancelamento"
          Icon={XCircleIcon}
          value={`${(metrics?.cancellationRate ?? 0).toFixed(1)}%`}
          hint="do total de agendamentos"
        />

        <KpiCard
          label="Ticket médio"
          Icon={ReceiptIcon}
          value={formatCurrency(metrics?.averageTicket)}
          hint="ganho médio por agendamento"
          span="wide"
        />

        <div className="col-span-full lg:col-span-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className={labelClass}>
                Agenda · {rangeLabel}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RecentServices
                appointments={data?.nextAppointments}
                isLoading={isLoading}
                isError={isError}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
