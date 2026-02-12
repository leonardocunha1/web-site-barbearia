"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { CalendarIcon, ClockIcon, PencilIcon, PlusIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Column, GenericTable } from "@/shared/components/table/generic-table";

export function ScheduleSection() {
  const [schedule, setSchedule] = useState([
    {
      id: 1,
      date: "15/07/2023",
      time: "10:00",
      client: "João Silva",
      service: "Corte Social",
      status: "confirmed",
    },
    {
      id: 2,
      date: "15/07/2023",
      time: "11:30",
      client: "Carlos Oliveira",
      service: "Barba Completa",
      status: "confirmed",
    },
    {
      id: 3,
      date: "15/07/2023",
      time: "14:00",
      client: "Ana Paula",
      service: "Coloração",
      status: "pending",
    },
    {
      id: 4,
      date: "16/07/2023",
      time: "09:00",
      client: "Miguel Santos",
      service: "Corte + Barba",
      status: "canceled",
    },
  ]);

  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day");

  const toggleScheduleStatus = (id: number, newStatus: string) => {
    setSchedule(
      schedule.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item,
      ),
    );
  };

  const columns: Column<(typeof schedule)[number]>[] = [
    {
      header: "Data",
      accessor: "date",
      render: (value) => (
        <div className="flex items-center">
          <CalendarIcon className="text-muted-foreground mr-2 h-4 w-4" />
          {value}
        </div>
      ),
    },
    {
      header: "Horário",
      accessor: "time",
      render: (value) => (
        <div className="flex items-center">
          <ClockIcon className="text-muted-foreground mr-2 h-4 w-4" />
          {value}
        </div>
      ),
    },
    {
      header: "Cliente",
      accessor: "client",
      className: "font-medium",
    },
    { header: "Serviço", accessor: "service" },
    {
      header: "Status",
      accessor: "status",
      render: (value) => (
        <Badge
          variant={
            value === "confirmed"
              ? "default"
              : value === "pending"
                ? "secondary"
                : "destructive"
          }
        >
          {value === "confirmed"
            ? "Confirmado"
            : value === "pending"
              ? "Pendente"
              : "Cancelado"}
        </Badge>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Minha Agenda</CardTitle>
        <div className="flex items-center space-x-4">
          <Select
            value={viewMode}
            onValueChange={(value: "day" | "week" | "month") =>
              setViewMode(value)
            }
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Visualização" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Dia</SelectItem>
              <SelectItem value="week">Semana</SelectItem>
              <SelectItem value="month">Mês</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Novo Horário
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <GenericTable
          data={schedule}
          columns={columns}
          rowKey="id"
          actions={(row) => (
            <div className="flex items-center gap-2">
              <Select
                value={row.status}
                onValueChange={(value) => toggleScheduleStatus(row.id, value)}
              >
                <SelectTrigger className="h-8 w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">Confirmar</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="canceled">Cancelar</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="sm">
                <PencilIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
        />

        <div className="mt-4 flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            Total de {schedule.length} agendamentos
          </div>
          <Button variant="outline">Exportar Agenda</Button>
        </div>
      </CardContent>
    </Card>
  );
}

