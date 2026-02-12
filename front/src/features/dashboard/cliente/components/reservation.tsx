"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Column, GenericTable } from "@/shared/components/table/generic-table";

export function ReservationsSection() {
  const [reservations] = useState([
    {
      id: 1,
      date: "2023-07-15",
      time: "10:00",
      service: "Corte + Barba",
      barber: "João Silva",
      status: "confirmado",
    },
  ]);

  const columns: Column<(typeof reservations)[number]>[] = [
    { header: "Data", accessor: "date" },
    { header: "Horário", accessor: "time" },
    { header: "Serviço", accessor: "service" },
    { header: "Barbeiro", accessor: "barber" },
    {
      header: "Status",
      accessor: "status",
      render: (value) => (
        <Badge variant={value === "confirmado" ? "default" : "secondary"}>
          {value}
        </Badge>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Minhas Reservas</CardTitle>
      </CardHeader>
      <CardContent>
        <GenericTable
          data={reservations}
          columns={columns}
          rowKey="id"
          actions={() => (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <PencilIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-red-500">
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
        />

        <div className="mt-4 flex justify-end">
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Nova Reserva
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

