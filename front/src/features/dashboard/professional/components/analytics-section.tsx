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

const COLORS = ["#b5651d", "#7d4514", "#1f1f1f", "#cd7833", "#5f3510"];
const ACCENT = "#b5651d"; // cobre-500
const EMERALD = "#059669";
const TOOLTIP_STYLE = {
  backgroundColor: "oklch(0.985 0.008 75)",
  border: "1px solid oklch(0.82 0.01 70)",
  borderRadius: "0",
  fontSize: "12px",
};

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
    <div className="space-y-6">
      {/* Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground/70 font-mono text-[10px] tracking-widest uppercase">
            Receita estimada · 7 dias
          </CardTitle>
          <CardDescription className="font-display text-foreground text-xl font-medium tracking-tight">
            Baseado nos próximos agendamentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingSeries.some((item) => item.appointments > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={upcomingSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.82 0.01 70 / 0.4)" />
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
                  contentStyle={TOOLTIP_STYLE}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke={ACCENT}
                  name="Receita"
                  strokeWidth={2}
                  dot={{ fill: ACCENT, r: 4 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-foreground/60 text-sm">
              Sem dados suficientes para gerar o gráfico.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Service Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground/70 font-mono text-[10px] tracking-widest uppercase">
              Distribuição por serviço
            </CardTitle>
            <CardDescription className="font-display text-foreground text-xl font-medium tracking-tight">
              Agendamentos por tipo
            </CardDescription>
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
                    fill={ACCENT}
                    dataKey="value"
                  >
                    {serviceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `${value} agendamentos`}
                    contentStyle={TOOLTIP_STYLE}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-foreground/60 text-sm">
                Sem serviços suficientes para exibir.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bookings Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground/70 font-mono text-[10px] tracking-widest uppercase">
              Agendamentos · 7 dias
            </CardTitle>
            <CardDescription className="font-display text-foreground text-xl font-medium tracking-tight">
              Distribuição dos próximos horários
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingSeries.some((item) => item.appointments > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={upcomingSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.82 0.01 70 / 0.4)" />
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
                    contentStyle={TOOLTIP_STYLE}
                  />
                  <Legend />
                  <Bar
                    dataKey="appointments"
                    fill={EMERALD}
                    name="Agendamentos"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-foreground/60 text-sm">
                Sem agendamentos futuros para exibir.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground/70 font-mono text-[10px] tracking-widest uppercase">
            Status · próximos
          </CardTitle>
          <CardDescription className="font-display text-foreground text-xl font-medium tracking-tight">
            Distribuição por status
          </CardDescription>
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
                  fill={ACCENT}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`status-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `${value} agendamentos`}
                  contentStyle={TOOLTIP_STYLE}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-foreground/60 text-sm">
              Sem dados de status para exibir.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Clients */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground/70 font-mono text-[10px] tracking-widest uppercase">
            Principais clientes
          </CardTitle>
          <CardDescription className="font-display text-foreground text-xl font-medium tracking-tight">
            Clientes com mais agendamentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {topClients.length ? (
            <ol className="border-foreground/15 divide-foreground/15 divide-y border-t border-b">
              {topClients.map((client, idx) => (
                <li
                  key={client.name}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-foreground/40 font-mono text-xs tracking-widest">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-foreground font-medium">
                        {client.name}
                      </p>
                      <p className="text-foreground/60 font-mono text-[10px] tracking-widest uppercase">
                        {client.bookings} agendamentos
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-cobre-700 font-mono text-base font-bold">
                      {formatCurrency(client.total)}
                    </p>
                    <p className="text-foreground/50 font-mono text-[10px] tracking-widest uppercase">
                      Estimativa
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="text-foreground/60 text-sm">
              Sem clientes suficientes para destacar.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-foreground/70 font-mono text-[10px] tracking-widest uppercase">
              Ticket médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-foreground text-2xl font-medium tracking-tight">
              {formatCurrency(averageTicket)}
            </p>
            <p className="text-foreground/60 mt-1 text-xs">Por agendamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-foreground/70 font-mono text-[10px] tracking-widest uppercase">
              Taxa de conclusão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-foreground text-2xl font-medium tracking-tight">
              {metrics?.appointments
                ? ((metrics.completed / metrics.appointments) * 100).toFixed(1)
                : "0.0"}
              %
            </p>
            <p className="text-foreground/60 mt-1 text-xs">
              Agendamentos concluídos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-foreground/70 font-mono text-[10px] tracking-widest uppercase">
              Receita total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-cobre-700 text-2xl font-medium tracking-tight">
              {formatCurrency(metrics?.earnings ?? 0)}
            </p>
            <p className="text-foreground/60 mt-1 text-xs">Total no período</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
