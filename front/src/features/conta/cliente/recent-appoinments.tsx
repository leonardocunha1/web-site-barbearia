import { Column, GenericTable } from "@/components/table/generic-table";
import { StatusBadge } from "@/components/table/status-badge";

type Appointment = {
  date: string;
  service: string;
  barber: string;
  status: "Concluído" | "Cancelado";
};

export function RecentAppointments() {
  const appointments: Appointment[] = [
    { date: "15/07/2023", service: "Corte de Cabelo", barber: "João", status: "Concluído" },
    { date: "10/07/2023", service: "Barba", barber: "Carlos", status: "Concluído" },
    { date: "05/07/2023", service: "Corte + Barba", barber: "Miguel", status: "Cancelado" },
  ];

  const columns: Column<Appointment>[] = [
    { header: "Data", accessor: "date" },
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
