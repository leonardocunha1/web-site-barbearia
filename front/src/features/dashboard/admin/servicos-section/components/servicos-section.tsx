"use client";

import { useEffect, useState } from "react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Edit } from "lucide-react";
import { GenericTable, Column } from "@/shared/components/table/generic-table";
import { toast } from "sonner";
import { ButtonStatus } from "@/shared/components/table/button-status";

import {
  useServiceFormModal,
  ServiceFormValues,
} from "../hooks/use-service-form-modal";
import { useServicesData } from "../hooks/use-services-data";
import type { Service } from "../types";
import { servicesCreate, servicesUpdate } from "@/app/api/actions/services";

export default function ServicosSection() {
  const { services, isLoading, error, refetch } = useServicesData();
  const [creating, setCreating] = useState(false);

  const { openServiceForm } = useServiceFormModal();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleAdd = () => {
    openServiceForm({
      mode: "create",
      onSubmit: async (values: ServiceFormValues) => {
        setCreating(true);
        const { ok, error } = await servicesCreate({
          nome: values.nome,
          descricao: values.descricao,
          categoria: values.categoria,
          ativo: values.ativo === "Ativo",
        });

        if (ok) {
          toast.success("Serviço criado com sucesso!");
          await refetch();
        } else {
          toast.error(error || "Erro ao criar serviço");
        }

        setCreating(false);
      },
    });
  };

  const handleEdit = (service: Service) => {
    openServiceForm({
      mode: "edit",
      initialValues: {
        nome: service.nome,
        descricao: service.descricao,
        categoria:
          service.categoria === "Cabelo + Barba"
            ? "completo"
            : service.categoria === "Cabelo"
              ? "cabelo"
              : "barba",
        ativo: service.ativo,
      },
      onSubmit: async (values: ServiceFormValues) => {
        const { ok, error } = await servicesUpdate(service.id, {
          nome: values.nome,
          descricao: values.descricao,
          categoria: values.categoria,
          ativo: values.ativo === "Ativo",
        });

        if (ok) {
          toast.success("Serviço atualizado com sucesso!");
          await refetch();
        } else {
          toast.error(error || "Erro ao atualizar serviço");
        }
      },
    });
  };

  const columns: Column<Service>[] = [
    { header: "Nome", accessor: "nome" },
    { header: "Descrição", accessor: "descricao" },
    { header: "Categoria", accessor: "categoria" },
    {
      header: "Status",
      accessor: "ativo",
      render: (value) => <ButtonStatus value={value as string} />,
      align: "center",
    },
  ];

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="border-principal-500 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-t-transparent" />
        <p className="text-principal-600 mt-2 text-sm">
          Carregando serviços...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-stone-50 p-5 shadow">
        <div>
          <Button
            onClick={handleAdd}
            disabled={creating}
            className="bg-principal-500 hover:bg-principal-600 cursor-pointer text-white"
          >
            Novo Serviço
          </Button>
        </div>
        <GenericTable
          data={services}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="Nenhum serviço cadastrado"
          rowKey="id"
          className="rounded-lg border"
          headerClassName="bg-gray-50"
          actions={(row) => (
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleEdit(row)}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
        />
      </Card>
    </div>
  );
}
