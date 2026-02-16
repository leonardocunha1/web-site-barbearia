import { useMemo } from "react";
import { Column, GenericTable } from "@/shared/components/table/generic-table";
import { StatusBadge } from "@/shared/components/table/status-badge";
import {
  formatBookingDateTime,
  formatBookingServices,
  formatBookingStatus,
} from "@/features/bookings/utils/booking-formatters";
import { useRecentBookings } from "../hooks/use-user-bookings";

type Appointment = {
  date: string;
  service: string;
  barber: string;
  status: string;
  points: number;
};

export function RecentAppointments() {
  const { bookings, isLoading, isError } = useRecentBookings(5);

  const appointments = useMemo<Appointment[]>(() => {
    return bookings.map((booking) => {
      const { date } = formatBookingDateTime(booking.startDateTime);

      return {
        date,
        service: formatBookingServices(booking.items),
        barber: booking.professional?.user?.name ?? "-",
        status: formatBookingStatus(booking.status),
        points: booking.pointsEarned ?? 0,
      };
    });
  }, [bookings]);

  const columns: Column<Appointment>[] = [
    { header: "Data", accessor: "date" },
    { header: "Serviço", accessor: "service" },
    { header: "Barbeiro", accessor: "barber" },
    {
      header: "Pontos",
      accessor: "points",
      align: "center",
      width: "90px",
    },
    {
      header: "Status",
      accessor: "status",
      render: (value) => <StatusBadge status={String(value)} />,
      align: "center",
      width: "120px",
    },
  ];

  if (isLoading) {
    return (
      <div className="text-muted-foreground text-sm">
        Carregando historico...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-sm text-red-600">
        Nao foi possivel carregar o historico.
      </div>
    );
  }

  return (
    <GenericTable
      data={appointments}
      columns={columns}
      rowKey="date"
      className="rounded-lg border"
      headerClassName="bg-gray-50"
      emptyMessage="Nenhum agendamento encontrado"
    />
  );
}
