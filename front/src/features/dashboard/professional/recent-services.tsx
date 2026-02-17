import { Column, GenericTable } from "@/shared/components/table/generic-table";
import { StatusBadge } from "@/shared/components/table/status-badge";
import {
  formatBookingDateTime,
  formatBookingStatus,
} from "@/features/bookings/utils/booking-formatters";
import type { GetProfessionalDashboard200NextAppointmentsItem } from "@/api";

type Service = {
  id: string;
  time: string;
  client: string;
  service: string;
  status: "Confirmado" | "Pendente" | "Cancelado" | "Concluido" | "Concluído";
};

type RecentServicesProps = {
  appointments?: GetProfessionalDashboard200NextAppointmentsItem[];
  isLoading?: boolean;
  isError?: boolean;
};

export function RecentServices({
  appointments,
  isLoading,
  isError,
}: RecentServicesProps) {
  if (isLoading) {
    return (
      <div className="text-muted-foreground text-sm">Carregando agenda...</div>
    );
  }

  if (isError) {
    return (
      <div className="text-sm text-red-600">
        Nao foi possivel carregar a agenda.
      </div>
    );
  }

  const services: Service[] =
    appointments?.map((appointment) => {
      const dateTime = formatBookingDateTime(appointment.date);
      const label =
        dateTime.date === "-" ? "-" : `${dateTime.date} ${dateTime.time}`;

      return {
        id: appointment.id,
        time: label,
        client: appointment.clientName,
        service: appointment.service,
        status: formatBookingStatus(
          appointment.status as
            | "PENDING"
            | "CONFIRMED"
            | "CANCELED"
            | "COMPLETED",
        ) as Service["status"],
      };
    }) ?? [];

  const columns: Column<Service>[] = [
    {
      header: "Horário",
      accessor: "time",
      width: "100px",
      align: "center",
    },
    {
      header: "Cliente",
      accessor: "client",
      className: "font-medium",
    },
    {
      header: "Serviço",
      accessor: "service",
    },
    {
      header: "Status",
      accessor: "status",
      render: (value) => <StatusBadge status={value} />,
      align: "center",
      width: "120px",
    },
  ];

  return (
    <GenericTable
      data={services}
      columns={columns}
      rowKey="id"
      onRowClick={(service) => console.log("Servico clicado:", service)}
      rowClassName={(service) =>
        service.status === "Cancelado" ? "bg-rose-50" : ""
      }
      emptyMessage="Nenhum serviço agendado recentemente"
      className="rounded-lg border"
      headerClassName="bg-gray-50"
    />
  );
}
