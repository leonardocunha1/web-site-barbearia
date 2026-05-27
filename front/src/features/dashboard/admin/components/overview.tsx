"use client";

import { useGetAdminDashboard } from "@/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  CalendarIcon,
  UserPlusIcon,
  UserMinusIcon,
  UsersIcon,
  TrendUpIcon,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { Skeleton } from "@/shared/components/ui/skeleton";

const formatCurrency = (value?: number | null) => {
  if (value === null || value === undefined) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const labelClass =
  "text-foreground/70 font-mono text-[10px] tracking-widest uppercase";

type KpiCardProps = {
  label: string;
  Icon: Icon;
  value: React.ReactNode;
  hint: string;
};

function KpiCard({ label, Icon, value, hint }: KpiCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <CardTitle className={labelClass}>{label}</CardTitle>
        <Icon weight="duotone" className="text-cobre-700 h-5 w-5" />
      </CardHeader>
      <CardContent>
        <div className="font-display text-foreground text-3xl leading-tight font-medium tracking-tight">
          {value}
        </div>
        <p className="text-foreground/60 mt-1 text-xs">{hint}</p>
      </CardContent>
    </Card>
  );
}

export function OverviewSection() {
  const { data: dashboard, isLoading } = useGetAdminDashboard();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="mt-2 h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const metrics = dashboard?.metrics;
  const topProfessionals = dashboard?.topProfessionals ?? [];
  const topServices = dashboard?.topServices ?? [];
  const financial = dashboard?.financial;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        label="Profissionais"
        Icon={UsersIcon}
        value={String(metrics?.professionalsActive ?? 0).padStart(2, "0")}
        hint="Ativos no sistema"
      />

      <KpiCard
        label="Novos cadastros"
        Icon={UserPlusIcon}
        value={String(metrics?.newProfessionals ?? 0).padStart(2, "0")}
        hint="este mês"
      />

      <KpiCard
        label="Agendamentos hoje"
        Icon={CalendarIcon}
        value={String(metrics?.bookingsToday ?? 0).padStart(2, "0")}
        hint="agendamentos realizados"
      />

      <KpiCard
        label="Cancelamentos"
        Icon={UserMinusIcon}
        value={String(metrics?.cancellationsLast24h ?? 0).padStart(2, "0")}
        hint="nas últimas 24h"
      />

      {topProfessionals.length > 0 && (
        <div className="col-span-full">
          <Card>
            <CardHeader>
              <CardTitle className={labelClass}>
                Top profissionais · este mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="border-foreground/15 divide-foreground/15 divide-y border-t border-b">
                {topProfessionals.map((professional, idx) => (
                  <li
                    key={professional.id}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-foreground/40 font-mono text-xs tracking-widest">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="text-foreground font-medium">
                        {professional.name}
                      </span>
                    </div>
                    <span className="text-foreground/60 font-mono text-[10px] tracking-widest uppercase">
                      {professional.totalBookings} atendimento
                      {professional.totalBookings !== 1 ? "s" : ""}
                    </span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      )}

      {topServices.length > 0 && (
        <div className="col-span-full">
          <Card>
            <CardHeader>
              <CardTitle className={labelClass}>
                Serviços mais agendados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="border-foreground/15 divide-foreground/15 divide-y border-t border-b">
                {topServices.map((service, idx) => (
                  <li
                    key={service.id}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-foreground/40 font-mono text-xs tracking-widest">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="text-foreground font-medium">
                        {service.name}
                      </span>
                    </div>
                    <span className="text-foreground/60 font-mono text-[10px] tracking-widest uppercase">
                      {service.totalBookings} agendamento
                      {service.totalBookings !== 1 ? "s" : ""}
                    </span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      )}

      {financial && (
        <div className="col-span-full">
          <Card>
            <CardHeader>
              <CardTitle
                className={`${labelClass} flex items-center gap-2`}
              >
                <TrendUpIcon weight="duotone" className="text-cobre-700 h-4 w-4" />
                Resumo financeiro · este mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="border-cobre-600 border-l-2 px-4 py-2">
                  <p className={labelClass}>Faturamento total</p>
                  <p className="font-display text-cobre-700 mt-1 text-2xl font-medium tracking-tight">
                    {formatCurrency(financial.revenueTotal)}
                  </p>
                </div>
                <div className="border-foreground/15 border-l px-4 py-2">
                  <p className={labelClass}>Serviços realizados</p>
                  <p className="font-display text-foreground mt-1 text-2xl font-medium tracking-tight">
                    {financial.completedBookings}
                  </p>
                </div>
                <div className="border-foreground/15 border-l px-4 py-2">
                  <p className={labelClass}>Ticket médio</p>
                  <p className="font-display text-foreground mt-1 text-2xl font-medium tracking-tight">
                    {formatCurrency(financial.averageTicket)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
