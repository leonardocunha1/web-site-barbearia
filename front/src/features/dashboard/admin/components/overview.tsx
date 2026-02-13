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
  UserXIcon,
  UsersIcon,
  TrendingUpIcon,
  AlertCircleIcon,
} from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";

const formatCurrency = (value?: number | null) => {
  if (value === null || value === undefined) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export function OverviewSection() {
  const { data: dashboard, isLoading } = useGetAdminDashboard();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:px-0 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="w-full rounded-2xl shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12" />
              <Skeleton className="mt-2 h-3 w-24" />
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:px-0 lg:grid-cols-4">
      <Card className="w-full rounded-2xl shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Profissionais</CardTitle>
          <UsersIcon className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics?.professionalsActive}
          </div>
          <p className="text-muted-foreground text-xs">Ativos no sistema</p>
        </CardContent>
      </Card>

      <Card className="w-full rounded-2xl shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Novos Cadastros</CardTitle>
          <UserPlusIcon className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics?.newProfessionals}</div>
          <p className="text-muted-foreground text-xs">este mês</p>
        </CardContent>
      </Card>

      <Card className="w-full rounded-2xl shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Agendamentos Hoje
          </CardTitle>
          <CalendarIcon className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics?.bookingsToday}</div>
          <p className="text-muted-foreground text-xs">
            Agendamentos realizados
          </p>
        </CardContent>
      </Card>

      <Card className="w-full rounded-2xl shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Cancelamentos</CardTitle>
          <UserXIcon className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics?.cancellationsLast24h}
          </div>
          <p className="text-muted-foreground text-xs">nas últimas 24h</p>
        </CardContent>
      </Card>

      {topProfessionals.length > 0 && (
        <div className="col-span-full">
          <Card className="w-full rounded-2xl shadow">
            <CardHeader>
              <CardTitle>Top Profissionais do Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {topProfessionals.map((professional) => (
                  <li key={professional.id} className="flex justify-between">
                    <span>{professional.name}</span>
                    <span className="text-muted-foreground text-sm">
                      {professional.totalBookings} atendimento
                      {professional.totalBookings !== 1 ? "s" : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {topServices.length > 0 && (
        <div className="col-span-full">
          <Card className="w-full rounded-2xl shadow">
            <CardHeader>
              <CardTitle>Serviços Mais Agendados</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {topServices.map((service) => (
                  <li key={service.id} className="flex justify-between">
                    <span>{service.name}</span>
                    <span className="text-muted-foreground text-sm">
                      {service.totalBookings} agendamento
                      {service.totalBookings !== 1 ? "s" : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {financial && (
        <div className="col-span-full">
          <Card className="w-full rounded-2xl shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUpIcon className="h-4 w-4" />
                Resumo Financeiro - Este Mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-sm font-medium text-black">
                    {formatCurrency(financial.revenueTotal)}
                  </p>
                  <p>Faturamento Total</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-black">
                    {financial.completedBookings}
                  </p>
                  <p>Serviços Realizados</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-black">
                    {formatCurrency(financial.averageTicket)}
                  </p>
                  <p>Ticket Médio</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
