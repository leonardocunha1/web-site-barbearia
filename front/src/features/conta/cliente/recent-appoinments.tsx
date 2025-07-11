import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function RecentAppointments() {
  const appointments = [
    {
      date: "15/07/2023",
      service: "Corte de Cabelo",
      barber: "João",
      status: "Concluído",
    },
    {
      date: "10/07/2023",
      service: "Barba",
      barber: "Carlos",
      status: "Concluído",
    },
    {
      date: "05/07/2023",
      service: "Corte + Barba",
      barber: "Miguel",
      status: "Cancelado",
    },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Serviço</TableHead>
          <TableHead>Barbeiro</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((appointment, index) => (
          <TableRow key={index}>
            <TableCell>{appointment.date}</TableCell>
            <TableCell>{appointment.service}</TableCell>
            <TableCell>{appointment.barber}</TableCell>
            <TableCell>
              <span
                className={`rounded-full px-2 py-1 text-xs ${
                  appointment.status === "Concluído"
                    ? "bg-green-100 text-green-800"
                    : appointment.status === "Cancelado"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {appointment.status}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
