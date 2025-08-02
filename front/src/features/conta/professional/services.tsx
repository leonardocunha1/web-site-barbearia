"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Column, GenericTable } from "@/components/table/generic-table";

type Service = {
  id: number;
  name: string;
  duration: string;
  price: string;
  category: string;
  active: boolean;
};

export function ServicesSection() {
  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      name: "Corte Social",
      duration: "45 min",
      price: "R$ 50,00",
      category: "Cabelo",
      active: true,
    },
    {
      id: 2,
      name: "Barba Completa",
      duration: "30 min",
      price: "R$ 35,00",
      category: "Barba",
      active: true,
    },
    {
      id: 3,
      name: "Hidratação Capilar",
      duration: "20 min",
      price: "R$ 40,00",
      category: "Tratamento",
      active: false,
    },
  ]);

  const toggleServiceStatus = (id: number) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, active: !service.active } : service,
      ),
    );
  };

  const columns: Column<Service>[] = [
    { header: "Serviço", accessor: "name" },
    { header: "Duração", accessor: "duration" },
    { header: "Preço", accessor: "price" },
    {
      header: "Categoria",
      accessor: "category",
      render: (value) => <Badge variant="outline">{value}</Badge>,
    },
    {
      header: "Status",
      accessor: "active",
      render: (value) => (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Ativo" : "Inativo"}
        </Badge>
      ),
    },
    {
      header: "Ações",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      accessor: "action" as any,
      align: "center",
      render: (_, row) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleServiceStatus(row.id)}
          >
            {row.active ? "Desativar" : "Ativar"}
          </Button>
          <Button variant="ghost" size="sm">
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-red-500">
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meus Serviços</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <GenericTable
          data={services}
          columns={columns}
          rowKey="id"
          emptyMessage="Nenhum serviço cadastrado"
        />
        <div className="flex justify-end">
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Adicionar Serviço
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
