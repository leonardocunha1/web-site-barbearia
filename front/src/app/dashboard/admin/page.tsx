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
  Activity,
} from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { motion } from "framer-motion";

const formatCurrency = (value?: number | null) => {
  if (value === null || value === undefined) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function StatsCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}) {
  return (
    <motion.div variants={item}>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-stone-600">
            {title}
          </CardTitle>
          <Icon className="h-4 w-4 text-stone-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {description && (
            <p className="mt-1 text-xs text-stone-500">{description}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function AdminOverviewPage() {
  const { data: dashboard, isLoading } = useGetAdminDashboard();

  if (isLoading) {
    return (
      <div className="h-full space-y-6 p-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const metrics = dashboard?.metrics;
  const topProfessionals = dashboard?.topProfessionals ?? [];
  const topServices = dashboard?.topServices ?? [];
  const financial = dashboard?.financial;

  return (
    <div className="h-full space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">
          Painel do Administrador
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Visão geral do negócio e métricas importantes
        </p>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <StatsCard
          title="Profissionais Ativos"
          value={metrics?.professionalsActive || 0}
          icon={UsersIcon}
          description="No sistema"
        />
        <StatsCard
          title="Novos Cadastros"
          value={metrics?.newProfessionals || 0}
          icon={UserPlusIcon}
          description="Este mês"
        />
        <StatsCard
          title="Agendamentos Hoje"
          value={metrics?.bookingsToday || 0}
          icon={CalendarIcon}
          description="Agendamentos realizados"
        />
        <StatsCard
          title="Cancelamentos"
          value={metrics?.cancellationsLast24h || 0}
          icon={UserXIcon}
          description="Nas últimas 24h"
        />
      </motion.div>

      {/* Financial Summary */}
      {financial && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUpIcon className="h-5 w-5 text-green-600" />
                <CardTitle>Resumo Financeiro - Este Mês</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm text-stone-600">Faturamento Total</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(financial.revenueTotal)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-stone-600">Serviços Realizados</p>
                  <p className="text-2xl font-bold">
                    {financial.completedBookings}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-stone-600">Ticket Médio</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(financial.averageTicket)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Top Performers */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Professionals */}
        {topProfessionals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-stone-600" />
                  <CardTitle>Top Profissionais do Mês</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {topProfessionals.map((professional, index) => (
                    <motion.li
                      key={professional.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center justify-between rounded-lg border border-stone-200 p-3 transition-colors hover:bg-stone-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-sm font-bold text-white">
                          {index + 1}
                        </div>
                        <span className="font-medium">{professional.name}</span>
                      </div>
                      <span className="text-sm text-stone-500">
                        {professional.totalBookings} atendimento
                        {professional.totalBookings !== 1 ? "s" : ""}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Top Services */}
        {topServices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-stone-600" />
                  <CardTitle>Serviços Mais Agendados</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {topServices.map((service, index) => (
                    <motion.li
                      key={service.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center justify-between rounded-lg border border-stone-200 p-3 transition-colors hover:bg-stone-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-sm font-bold text-white">
                          {index + 1}
                        </div>
                        <span className="font-medium">{service.name}</span>
                      </div>
                      <span className="text-sm text-stone-500">
                        {service.totalBookings} agendamento
                        {service.totalBookings !== 1 ? "s" : ""}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
