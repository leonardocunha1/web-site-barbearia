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

export function ServicesSection() {
  const [services, setServices] = useState([
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
    setServices(
      services.map((service) =>
        service.id === id ? { ...service, active: !service.active } : service,
      ),
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meus Serviços</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Serviço</TableHead>
              <TableHead>Duração</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.name}</TableCell>
                <TableCell>{service.duration}</TableCell>
                <TableCell>{service.price}</TableCell>
                <TableCell>
                  <Badge variant="outline">{service.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={service.active ? "default" : "secondary"}>
                    {service.active ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleServiceStatus(service.id)}
                  >
                    {service.active ? "Desativar" : "Ativar"}
                  </Button>
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
            Adicionar Serviço
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
