"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { CalendarIcon, ClockIcon, PlusIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Column, GenericTable } from "@/shared/components/table/generic-table";
import { StatusBadge } from "@/shared/components/table/status-badge";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getListProfessionalBookingsQueryKey,
  useListProfessionalBookings,
  useUpdateBookingStatus,
} from "@/api";
import {
  buildDateRangeFilters,
  formatBookingDateTime,
  formatBookingServices,
  formatBookingStatus,
} from "@/features/bookings/utils/booking-formatters";
import { useTableParams } from "@/shared/hooks/useTableParams";
import { BookingFilters, useBookingDetailsModal } from "@/features/bookings";
import { BonusAssignDialog } from "./bonus-assign-dialog";

type ScheduleRow = {
  id: string;
  date: string;
  time: string;
  client: string;
  userId: string;
  service: string;
  status: string;
  statusValue: "PENDING" | "CONFIRMED" | "CANCELED" | "COMPLETED";
};

const statusOptions = [
  { value: "PENDING", label: "Pendente" },
  { value: "CONFIRMED", label: "Confirmar" },
  { value: "CANCELED", label: "Cancelar" },
  { value: "COMPLETED", label: "Concluir" },
] as const;

export function ScheduleSection() {
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day");
  const queryClient = useQueryClient();
  const { params, updateParams } = useTableParams();
  const { openBookingDetails } = useBookingDetailsModal();

  const { startDate, endDate } = buildDateRangeFilters(
    params.filters.startDate,
    params.filters.endDate,
  );

  const listParams = {
    page: params.page,
    limit: params.limit,
    status: params.filters.status || undefined,
    startDate,
    endDate,
  };

  const { data, isLoading, isError } = useListProfessionalBookings(listParams);

  const updateStatus = useUpdateBookingStatus({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getListProfessionalBookingsQueryKey(listParams),
        });
      },
      onError: () => {
        toast.error("Nao foi possivel atualizar o status.");
      },
    },
  });

  const schedule = useMemo<ScheduleRow[]>(() => {
    return (
      data?.bookings?.map((booking) => {
        const { date, time } = formatBookingDateTime(booking.startDateTime);

        return {
          id: booking.id,
          date,
          time,
          client: booking.user?.name ?? "-",
          userId: booking.userId,
          service: formatBookingServices(booking.items),
          status: formatBookingStatus(booking.status),
          statusValue: booking.status,
        };
      }) ?? []
    );
  }, [data]);

  const columns: Column<ScheduleRow>[] = [
    {
      header: "Data",
      accessor: "date",
      render: (value) => (
        <div className="flex items-center">
          <CalendarIcon className="text-muted-foreground mr-2 h-4 w-4" />
          {value}
        </div>
      ),
    },
    {
      header: "Horario",
      accessor: "time",
      render: (value) => (
        <div className="flex items-center">
          <ClockIcon className="text-muted-foreground mr-2 h-4 w-4" />
          {value}
        </div>
      ),
    },
    {
      header: "Cliente",
      accessor: "client",
      className: "font-medium",
    },
    { header: "Servico", accessor: "service" },
    {
      header: "Status",
      accessor: "status",
      render: (value) => <StatusBadge status={value} />,
      align: "center",
      width: "120px",
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Minha Agenda</CardTitle>
        <div className="flex items-center space-x-4">
          <Select
            value={viewMode}
            onValueChange={(value: "day" | "week" | "month") =>
              setViewMode(value)
            }
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Visualizacao" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Dia</SelectItem>
              <SelectItem value="week">Semana</SelectItem>
              <SelectItem value="month">Mes</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Novo Horario
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <BookingFilters
          value={{
            status: params.filters.status,
            startDate: params.filters.startDate,
            endDate: params.filters.endDate,
          }}
          onChange={(next) =>
            updateParams({
              page: 1,
              filters: {
                ...params.filters,
                status: next.status ?? "",
                startDate: next.startDate ?? "",
                endDate: next.endDate ?? "",
              },
            })
          }
        />

        {isLoading ? (
          <div className="text-muted-foreground text-sm">
            Carregando agenda...
          </div>
        ) : isError ? (
          <div className="text-sm text-red-600">
            Nao foi possivel carregar a agenda.
          </div>
        ) : (
          <GenericTable
            data={schedule}
            columns={columns}
            rowKey="id"
            emptyMessage="Nenhum agendamento encontrado"
            totalItems={data?.total ?? 0}
            showPagination
            onRowClick={(row) => openBookingDetails(row.id)}
            actions={(row) => (
              <div className="flex items-center gap-2">
                <Select
                  value={row.statusValue}
                  onValueChange={(value) =>
                    updateStatus.mutate({
                      bookingId: row.id,
                      data: { status: value },
                    })
                  }
                  disabled={updateStatus.isPending}
                >
                  <SelectTrigger className="h-8 w-[140px]">
                    <SelectValue placeholder="Atualizar" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <BonusAssignDialog
                  bookingId={row.id}
                  userId={row.userId}
                  clientName={row.client}
                />
              </div>
            )}
          />
        )}

        <div className="flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            Total de {data?.total ?? 0} agendamentos
          </div>
          <Button variant="outline">Exportar Agenda</Button>
        </div>
      </CardContent>
    </Card>
  );
}
