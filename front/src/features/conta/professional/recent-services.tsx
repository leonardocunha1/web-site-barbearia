import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function RecentServices() {
  const services = [
    {
      time: "10:00",
      client: "João Silva",
      service: "Corte Social",
      duration: "45 min",
      status: "Confirmado",
    },
    {
      time: "11:00",
      client: "Carlos Oliveira",
      service: "Barba Completa",
      duration: "30 min",
      status: "Confirmado",
    },
    {
      time: "14:30",
      client: "Miguel Santos",
      service: "Corte + Barba",
      duration: "1h 15min",
      status: "Pendente",
    },
    {
      time: "16:00",
      client: "Lucas Pereira",
      service: "Hidratação",
      duration: "20 min",
      status: "Cancelado",
    },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Horário</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Serviço</TableHead>
          <TableHead>Duração</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((service, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{service.time}</TableCell>
            <TableCell>{service.client}</TableCell>
            <TableCell>{service.service}</TableCell>
            <TableCell>{service.duration}</TableCell>
            <TableCell>
              <span
                className={`rounded-full px-2 py-1 text-xs ${
                  service.status === "Confirmado"
                    ? "bg-green-100 text-green-800"
                    : service.status === "Cancelado"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {service.status}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
