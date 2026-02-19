"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { LoadingState } from "@/shared/components/ui/loading-state";
import { ErrorState } from "@/shared/components/ui/error-state";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useGetProfessionalDashboard } from "@/api";
import {
  addDays,
  format,
  isSameDay,
  isValid,
  parseISO,
  startOfDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatBookingStatus } from "@/features/bookings/utils/booking-formatters";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const formatCurrency = (value?: number | null) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value ?? 0);

const buildUpcomingSeries = (
  appointments: { date: string }[] | undefined,
  averageTicket: number,
) => {
  const start = startOfDay(new Date());
  const days = Array.from({ length: 7 }, (_, index) => addDays(start, index));

  return days.map((day) => {
    const count =
      appointments?.reduce((acc, appointment) => {
        const parsed = parseISO(appointment.date);
        if (isValid(parsed) && isSameDay(parsed, day)) {
          return acc + 1;
        }
        return acc;
      }, 0) ?? 0;

    return {
      day: format(day, "EEE", { locale: ptBR }),
      dateLabel: format(day, "dd/MM"),
      appointments: count,
      revenue: Number((count * averageTicket).toFixed(2)),
    };
  });
};

export function AnalyticsSection() {
  const { data, isLoading, isError } = useGetProfessionalDashboard(
    { range: "week" },
    {
      query: {
        refetchInterval: 30000,
      },
    },
  );
  const appointments = useMemo(
    () => data?.nextAppointments ?? [],
    [data?.nextAppointments],
  );
  const metrics = data?.metrics;
  const averageTicket = metrics?.averageTicket ?? 0;

  const upcomingSeries = useMemo(
    () => buildUpcomingSeries(appointments, averageTicket),
    [appointments, averageTicket],
  );

  // Usar topServices do backend - mais eficiente e preciso
  const serviceData = useMemo(() => {
    if (!metrics?.topServices?.length) return [];
    return metrics.topServices.map((service) => ({
      name: service.service,
      value: service.count,
    }));
  }, [metrics?.topServices]);

  const statusData = useMemo(() => {
    if (!appointments.length) return [];

    const map = new Map<string, number>();
    appointments.forEach((appointment) => {
      const label = formatBookingStatus(appointment.status);
      map.set(label, (map.get(label) ?? 0) + 1);
    });

    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [appointments]);

  const topClients = useMemo(() => {
    if (!appointments.length) return [];

    const map = new Map<string, number>();
    appointments.forEach((appointment) => {
      const name = appointment.clientName?.trim();
      if (!name) return;
      map.set(name, (map.get(name) ?? 0) + 1);
    });

    return Array.from(map.entries())
      .map(([name, bookings]) => ({
        name,
        bookings,
        total: Number((bookings * averageTicket).toFixed(2)),
      }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5);
  }, [appointments, averageTicket]);

  if (isLoading) {
    return <LoadingState message="Carregando analises..." size="sm" />;
  }

  if (isError) {
    return (
      <ErrorState
        type="error"
        message="Nao foi possivel carregar as analises."
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Receita Estimada - Próximos 7 Dias</CardTitle>
          <CardDescription>
            Baseado nos próximos agendamentos do profissional
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingSeries.some((item) => item.appointments > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={upcomingSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  label={{ value: "R$", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(value as number)}
                  labelFormatter={(label, payload) =>
                    payload?.[0]?.payload?.dateLabel
                      ? `${label} (${payload[0].payload.dateLabel})`
                      : label
                  }
                  contentStyle={{
                    backgroundColor: "#fafafa",
                    border: "1px solid #e7e5e4",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  name="Receita"
                  strokeWidth={2}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-muted-foreground text-sm">
              Sem dados suficientes para gerar o gráfico.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Service Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Serviço</CardTitle>
            <CardDescription>Agendamentos por tipo de serviço</CardDescription>
          </CardHeader>
          <CardContent>
            {serviceData.length ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={serviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${Math.round((percent ?? 0) * 100)}%)`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {serviceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} agendamentos`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-muted-foreground text-sm">
                Sem serviços suficientes para exibir.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bookings Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Agendamentos - Próximos 7 Dias</CardTitle>
            <CardDescription>
              Distribuição dos próximos horários
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingSeries.some((item) => item.appointments > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={upcomingSeries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    label={{ value: "Qtd", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip
                    labelFormatter={(label, payload) =>
                      payload?.[0]?.payload?.dateLabel
                        ? `${label} (${payload[0].payload.dateLabel})`
                        : label
                    }
                    contentStyle={{
                      backgroundColor: "#fafafa",
                      border: "1px solid #e7e5e4",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="appointments"
                    fill="#10b981"
                    name="Agendamentos"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-muted-foreground text-sm">
                Sem agendamentos futuros para exibir.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status dos Próximos Agendamentos</CardTitle>
          <CardDescription>Distribuição por status</CardDescription>
        </CardHeader>
        <CardContent>
          {statusData.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${Math.round((percent ?? 0) * 100)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`status-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} agendamentos`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-muted-foreground text-sm">
              Sem dados de status para exibir.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Clients */}
      <Card>
        <CardHeader>
          <CardTitle>Principais Clientes</CardTitle>
          <CardDescription>Clientes com mais agendamentos</CardDescription>
        </CardHeader>
        <CardContent>
          {topClients.length ? (
            <div className="space-y-4">
              {topClients.map((client) => (
                <div
                  key={client.name}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex-1">
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-stone-500">
                      {client.bookings} agendamentos
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">
                      {formatCurrency(client.total)}
                    </p>
                    <p className="text-xs text-stone-500">Estimativa</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground text-sm">
              Sem clientes suficientes para destacar.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Ticket Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCurrency(averageTicket)}
            </p>
            <p className="mt-1 text-xs text-stone-500">Por agendamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Taxa de Conclusão</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {metrics?.appointments
                ? ((metrics.completed / metrics.appointments) * 100).toFixed(1)
                : "0.0"}
              %
            </p>
            <p className="mt-1 text-xs text-stone-500">
              Agendamentos concluídos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Receita Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCurrency(metrics?.earnings ?? 0)}
            </p>
            <p className="mt-1 text-xs text-stone-500">Total</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
