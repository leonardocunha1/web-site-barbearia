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
  DollarSignIcon,
  UserCheckIcon,
  UserXIcon,
} from "lucide-react";
import { useGetProfessionalDashboard } from "@/api";
import { formatBookingDateTime } from "@/features/bookings/utils/booking-formatters";
import { RecentServices } from "./recent-services";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

const formatCurrency = (value?: number | null) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value ?? 0);

const rangeOptions = [
  { value: "today", label: "Hoje" },
  { value: "week", label: "Semana" },
  { value: "month", label: "Mes" },
  { value: "custom", label: "Personalizado" },
] as const;

const formatToday = () => {
  const now = new Date();
  return now.toISOString().slice(0, 10);
};

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
    query: { enabled: isCustomReady },
  });

  const metrics = data?.metrics;
  const nextAppointment = data?.nextAppointments?.[0];
  const nextDateTime = formatBookingDateTime(nextAppointment?.date);
  const rangeLabel =
    rangeOptions.find((option) => option.value === range)?.label ?? "Hoje";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium">Periodo do dashboard</p>
          <p className="text-muted-foreground text-xs">
            Ajuste o intervalo para atualizar os indicadores.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <Label>Periodo</Label>
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
                <Label>Inicio</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Fim</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:px-0 lg:grid-cols-4">
        <Card className="w-full rounded-2xl shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Próximo Agendamento
            </CardTitle>
            <CalendarIcon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-muted-foreground text-sm">Carregando...</div>
            ) : isError ? (
              <div className="text-sm text-red-600">Erro ao carregar</div>
            ) : nextAppointment ? (
              <>
                <div className="text-2xl font-bold">
                  {nextDateTime.date} {nextDateTime.time}
                </div>
                <p className="text-muted-foreground text-xs">
                  {nextAppointment.clientName} - {nextAppointment.service}
                </p>
              </>
            ) : (
              <div className="text-muted-foreground text-sm">
                Sem agendamentos
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="w-full rounded-2xl shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Faturamento ({rangeLabel})
            </CardTitle>
            <DollarSignIcon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics?.earnings)}
            </div>
            <p className="text-muted-foreground text-xs">
              {metrics?.appointments ?? 0} agendamentos no periodo
            </p>
          </CardContent>
        </Card>

        <Card className="w-full rounded-2xl shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Clientes Atendidos
            </CardTitle>
            <UserCheckIcon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.completed ?? 0}</div>
            <p className="text-muted-foreground text-xs">
              atendimentos concluidos
            </p>
          </CardContent>
        </Card>

        <Card className="w-full rounded-2xl shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cancelamentos</CardTitle>
            <UserXIcon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.canceled ?? 0}</div>
            <p className="text-muted-foreground text-xs">no periodo</p>
          </CardContent>
        </Card>

        <div className="col-span-full">
          <Card className="w-full rounded-2xl shadow">
            <CardHeader>
              <CardTitle>Agenda ({rangeLabel})</CardTitle>
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
