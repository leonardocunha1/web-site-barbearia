"use client";

import { useGetProfessionalDashboard } from "@/api/react-query/professionals";
import { GetProfessionalDashboardRange } from "@/api/schemas/getProfessionalDashboardRange";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Award,
  BarChart3,
  Target,
  Percent,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { DatePicker } from "@/shared/components/ui/date-picker";

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
  trend,
  description,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: { value: number; label: string };
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
          {trend && (
            <div className="mt-1 flex items-center gap-1 text-xs">
              <TrendingUp
                className={`h-3 w-3 ${trend.value >= 0 ? "text-green-600" : "text-red-600"}`}
              />
              <span
                className={trend.value >= 0 ? "text-green-600" : "text-red-600"}
              >
                {trend.value >= 0 ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-stone-500">{trend.label}</span>
            </div>
          )}
          {description && (
            <p className="mt-1 text-xs text-stone-500">{description}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TopServices({
  data,
}: {
  data: Array<{ service: string; count: number; percentage: number }>;
}) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Award className="h-5 w-5" />
            Top 5 Serviços
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-stone-500">
            Nenhum serviço encontrado neste período.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Award className="h-5 w-5" />
          Top 5 Serviços
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((service, index) => (
            <motion.div
              key={service.service}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-900 text-xs font-bold text-white">
                    {index + 1}
                  </div>
                  <span className="font-medium text-stone-900">
                    {service.service}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-stone-900">
                    {service.count}x
                  </p>
                  <p className="text-xs text-stone-500">
                    {service.percentage.toFixed(1)}%
                  </p>
                </div>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${service.percentage}%` }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                  className="h-full bg-stone-900"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function UpcomingBookings({
  data,
}: {
  data: Array<{
    id: string;
    date: string;
    clientName: string;
    service: string;
    status: "PENDING" | "CONFIRMED";
    totalAmount?: number;
  }>;
}) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Próximos Agendamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-stone-500">
            Nenhum agendamento próximo encontrado.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-stone-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "Confirmado";
      case "PENDING":
        return "Pendente";
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Próximos Agendamentos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.slice(0, 5).map((booking, index) => {
            const bookingDate = new Date(booking.date);
            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start justify-between rounded-lg border border-stone-200 p-3 transition-colors hover:bg-stone-50"
              >
                <div className="flex items-start gap-3">
                  {getStatusIcon(booking.status)}
                  <div>
                    <p className="font-medium text-stone-900">
                      {booking.clientName}
                    </p>
                    <p className="text-sm text-stone-600">{booking.service}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs text-stone-500">
                        {getStatusText(booking.status)}
                      </span>
                      {booking.totalAmount !== undefined && (
                        <>
                          <span className="text-xs text-stone-400">•</span>
                          <span className="text-xs font-medium text-green-600">
                            R${" "}
                            {booking.totalAmount.toFixed(2).replace(".", ",")}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-stone-900">
                    {bookingDate.toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </p>
                  <p className="text-xs text-stone-500">
                    {bookingDate.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProfessionalOverviewPage() {
  const [range, setRange] =
    useState<
      (typeof GetProfessionalDashboardRange)[keyof typeof GetProfessionalDashboardRange]
    >("week");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");

  // Formatar datas para o formato ISO datetime que a API espera
  const formatDateToISO = (dateString: string) => {
    if (!dateString) return undefined;
    const date = new Date(dateString);
    return date.toISOString();
  };

  const { data, refetch, isLoading } = useGetProfessionalDashboard(
    {
      range,
      startDate:
        range === "custom" ? formatDateToISO(customStartDate) : undefined,
      endDate: range === "custom" ? formatDateToISO(customEndDate) : undefined,
    },
    {
      query: {
        refetchInterval: 30000,
        enabled: range !== "custom" || (!!customStartDate && !!customEndDate),
      },
    },
  );

  useEffect(() => {}, [isLoading]);

  const handleManualRefresh = async () => {
    await refetch();
  };

  // const getLastUpdateText = () => {
  //   if (!lastUpdated) return "Aguardando atualização...";
  //   const now = new Date();
  //   const diffSeconds = Math.floor(
  //     (now.getTime() - lastUpdated.getTime()) / 1000,
  //   );

  //   if (diffSeconds < 60) {
  //     return `Atualizado há ${diffSeconds}s`;
  //   }
  //   return `Atualizado há ${Math.floor(diffSeconds / 60)}m`;
  // };

  const getRangeLabel = () => {
    switch (range) {
      case "all":
        return "Todos os Períodos";
      case "today":
        return "Hoje";
      case "week":
        return "Esta Semana";
      case "month":
        return "Este Mês";
      case "custom":
        if (customStartDate && customEndDate) {
          const start = new Date(customStartDate).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
          });
          const end = new Date(customEndDate).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
          });
          return `${start} - ${end}`;
        }
        return "Personalizado";
      default:
        return "";
    }
  };

  if (isLoading) {
    return (
      <div className="h-full space-y-6 p-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const metrics = data?.metrics;

  return (
    <div className="h-full space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            Olá, {data?.professional?.name || "Profissional"}
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Atualização automática a cada 30s
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={range}
            onValueChange={(value) => setRange(value as typeof range)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Períodos</SelectItem>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mês</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleManualRefresh}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Custom Date Range Picker */}
      {range === "custom" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Período Personalizado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-stone-700">
                  Data Inicial
                </label>
                <DatePicker
                  value={customStartDate}
                  max={customEndDate || undefined}
                  onChange={setCustomStartDate}
                  placeholder="Selecione a data inicial"
                />
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-stone-700">
                  Data Final
                </label>
                <DatePicker
                  value={customEndDate}
                  min={customStartDate || undefined}
                  onChange={setCustomEndDate}
                  placeholder="Selecione a data final"
                />
              </div>
            </div>
            {range === "custom" && (!customStartDate || !customEndDate) && (
              <p className="mt-2 text-xs text-yellow-600">
                Selecione ambas as datas para visualizar as métricas
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stats Grid - Métricas Principais */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-stone-900">
          Métricas Gerais - {getRangeLabel()}
        </h2>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          <StatsCard
            title="Total de Agendamentos"
            value={metrics?.appointments || 0}
            icon={Calendar}
            description={`${metrics?.completed || 0} concluídos, ${metrics?.canceled || 0} cancelados`}
          />
          <StatsCard
            title="Receita do Período"
            value={`R$ ${(metrics?.earnings || 0).toFixed(2).replace(".", ",")}`}
            icon={DollarSign}
            description={`Ticket médio: R$ ${(metrics?.averageTicket || 0).toFixed(2).replace(".", ",")}`}
          />
          <StatsCard
            title="Agendamentos Pendentes"
            value={metrics?.pendingCount || 0}
            icon={Clock}
            description="Aguardando confirmação"
          />
          <StatsCard
            title="Taxa de Conclusão"
            value={`${(metrics?.completionRate || 0).toFixed(1)}%`}
            icon={CheckCircle2}
            description={`${metrics?.completed || 0} de ${metrics?.appointments || 0} agendamentos`}
          />
        </motion.div>
      </div>

      {/* Stats Grid - Métricas Detalhadas */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-stone-900">
          Desempenho
        </h2>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          <StatsCard
            title="Agendamentos Concluídos"
            value={metrics?.completed || 0}
            icon={Target}
            description="Finalizados com sucesso"
          />
          <StatsCard
            title="Agendamentos Cancelados"
            value={metrics?.canceled || 0}
            icon={XCircle}
            description="Cancelados no período"
          />
          <StatsCard
            title="Taxa de Cancelamento"
            value={`${(metrics?.cancellationRate || 0).toFixed(1)}%`}
            icon={Percent}
            description={`${metrics?.canceled || 0} de ${metrics?.appointments || 0} agendamentos`}
          />
          <StatsCard
            title="Ticket Médio"
            value={`R$ ${(metrics?.averageTicket || 0).toFixed(2).replace(".", ",")}`}
            icon={BarChart3}
            description="Receita média por agendamento"
          />
        </motion.div>
      </div>

      {/* Top Services and Upcoming Bookings */}
      <div className="grid gap-4 lg:grid-cols-2">
        <TopServices data={metrics?.topServices || []} />
        <UpcomingBookings data={data?.nextAppointments || []} />
      </div>
    </div>
  );
}
