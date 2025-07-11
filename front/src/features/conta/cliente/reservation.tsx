"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";

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
    // mais reservas...
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Minhas Reservas</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Horário</TableHead>
              <TableHead>Serviço</TableHead>
              <TableHead>Barbeiro</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>{reservation.date}</TableCell>
                <TableCell>{reservation.time}</TableCell>
                <TableCell>{reservation.service}</TableCell>
                <TableCell>{reservation.barber}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      reservation.status === "confirmado"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {reservation.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500">
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

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
