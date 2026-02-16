"use client";

import { useMemo } from "react";
import { differenceInMinutes, parseISO } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Column, GenericTable } from "@/shared/components/table/generic-table";
import { StatusBadge } from "@/shared/components/table/status-badge";
import { Button } from "@/shared/components/ui/button";
import {
  useListUserBookings,
  useCancelUserBooking,
  ListUserBookingsStatus,
} from "@/api";
import {
  buildDateRangeFilters,
  formatBookingDateTime,
  formatBookingServices,
  formatBookingStatus,
} from "@/features/bookings/utils/booking-formatters";
import { useTableParams } from "@/shared/hooks/useTableParams";
import { BookingFilters } from "@/features/bookings";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type ReservationRow = {
  id: string;
  date: string;
  time: string;
  service: string;
  barber: string;
  status: string;
  statusValue: "PENDING" | "CONFIRMED" | "CANCELED" | "COMPLETED";
  startDateTime: string;
};

export function ReservationsSection() {
  const { params, updateParams } = useTableParams();
  const queryClient = useQueryClient();
  const cancelBooking = useCancelUserBooking({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/bookings/me"] });
        toast.success("Agendamento cancelado.");
      },
      onError: () => {
        toast.error("Nao foi possivel cancelar o agendamento.");
      },
    },
  });

  const { startDate, endDate } = buildDateRangeFilters(
    params.filters.startDate,
    params.filters.endDate,
  );

  const listParams = {
    page: params.page,
    limit: params.limit,
    status: params.filters.status
      ? (params.filters.status as ListUserBookingsStatus)
      : undefined,
    startDate,
    endDate,
  };

  const { data, isLoading, isError } = useListUserBookings(listParams);

  const reservations = useMemo<ReservationRow[]>(() => {
    return (
      data?.bookings?.map((booking) => {
        const { date, time } = formatBookingDateTime(booking.startDateTime);

        return {
          id: booking.id,
          date,
          time,
          service: formatBookingServices(booking.items),
          barber: booking.professional?.user?.name ?? "-",
          status: formatBookingStatus(booking.status),
          statusValue: booking.status,
          startDateTime: booking.startDateTime,
        };
      }) ?? []
    );
  }, [data]);

  const canCancelBooking = (row: ReservationRow) => {
    if (row.statusValue !== "PENDING") return false;
    const minutesToStart = differenceInMinutes(
      parseISO(row.startDateTime),
      new Date(),
    );
    return minutesToStart >= 120;
  };

  const columns: Column<ReservationRow>[] = [
    { header: "Data", accessor: "date" },
    { header: "Horário", accessor: "time" },
    { header: "Serviço", accessor: "service" },
    { header: "Barbeiro", accessor: "barber" },
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
      <CardHeader>
        <CardTitle>Minhas Reservas</CardTitle>
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
            Carregando reservas...
          </div>
        ) : isError ? (
          <div className="text-sm text-red-600">
            Nao foi possivel carregar suas reservas.
          </div>
        ) : (
          <GenericTable
            data={reservations}
            columns={columns}
            rowKey="id"
            emptyMessage="Nenhuma reserva encontrada"
            totalItems={data?.total ?? 0}
            showPagination
            actions={(row) => {
              const isCancelable = canCancelBooking(row);
              return (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!isCancelable || cancelBooking.isPending}
                  title={
                    isCancelable
                      ? "Cancelar agendamento"
                      : "Cancelamento permitido apenas ate 2 horas antes"
                  }
                  onClick={() =>
                    cancelBooking.mutate({
                      bookingId: row.id,
                      data: {},
                    })
                  }
                >
                  Cancelar
                </Button>
              );
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
