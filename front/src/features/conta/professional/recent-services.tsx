import { Column, GenericTable } from "@/components/table/generic-table";
import { StatusBadge } from "@/components/table/status-badge";

type Service = {
  id: string;
  time: string;
  client: string;
  service: string;
  duration: string;
  status: "Confirmado" | "Pendente" | "Cancelado" | "Concluído";
};

export function RecentServices() {
  const services: Service[] = [
    { id: "1", time: "10:00", client: "João Silva", service: "Corte Social", duration: "45 min", status: "Confirmado" },
    { id: "2", time: "11:00", client: "Carlos Oliveira", service: "Barba Completa", duration: "30 min", status: "Confirmado" },
    { id: "3", time: "14:30", client: "Miguel Santos", service: "Corte + Barba", duration: "1h 15min", status: "Pendente" },
    { id: "4", time: "16:00", client: "Lucas Pereira", service: "Hidratação", duration: "20 min", status: "Cancelado" },
  ];

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
    header: "Duração", 
    accessor: "duration",
    align: "center",
  },
  {
    header: "Status",
    accessor: "status",
    render: (value) => (
  <StatusBadge status={value} />
),
    align: "center",
    width: "120px",
  },
];


  return (
    <GenericTable
      data={services}
      columns={columns}
      rowKey="id"
      onRowClick={(service) => console.log("Serviço clicado:", service)}
      rowClassName={(service) => service.status === "Cancelado" ? "bg-rose-50" : ""}
      emptyMessage="Nenhum serviço agendado recentemente"
      className="rounded-lg border"
      headerClassName="bg-gray-50"
    />
  );
}