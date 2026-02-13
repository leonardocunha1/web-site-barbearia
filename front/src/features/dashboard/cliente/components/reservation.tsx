"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Column, GenericTable } from "@/shared/components/table/generic-table";
import { StatusBadge } from "@/shared/components/table/status-badge";
import { useListUserBookings } from "@/api";
import {
  buildDateRangeFilters,
  formatBookingDateTime,
  formatBookingServices,
  formatBookingStatus,
} from "@/features/bookings/utils/booking-formatters";
import { useTableParams } from "@/shared/hooks/useTableParams";
import {
  BookingFilters,
  useBookingDetailsModal,
  useBookingFormModal,
} from "@/features/bookings";

type ReservationRow = {
  id: string;
  date: string;
  time: string;
  service: string;
  barber: string;
  status: string;
};

export function ReservationsSection() {
  const { params, updateParams } = useTableParams();
  const { openBookingForm } = useBookingFormModal();
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
        };
      }) ?? []
    );
  }, [data]);

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
            onRowClick={(row) => openBookingDetails(row.id)}
          />
        )}

        <div className="flex justify-end">
          <Button onClick={openBookingForm}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Nova Reserva
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
