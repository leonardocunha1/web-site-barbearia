"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Edit } from "lucide-react";
import { GenericTable, Column } from "@/shared/components/table/generic-table";
import { toast } from "sonner";
import { ButtonStatus } from "@/shared/components/table/button-status";
import {
  getListServicesQueryKey,
  useCreateService,
  useUpdateServiceById,
} from "@/api";
import { LoadingState } from "@/shared/components/ui/loading-state";

import {
  useServiceFormModal,
  ServiceFormValues,
} from "../hooks/use-service-form-modal";
import { useServicesData } from "../hooks/use-services-data";
import type { Service } from "../types";

const formatServiceType = (value: Service["tipo"]) => {
  switch (value) {
    case "CORTE":
      return "Corte";
    case "BARBA":
      return "Barba";
    case "SOBRANCELHA":
      return "Sobrancelha";
    case "ESTETICA":
    default:
      return "Estética";
  }
};

export default function ServicesSection() {
  const queryClient = useQueryClient();
  const { services, isLoading, error, refetch } = useServicesData();
  const { mutateAsync: createService, isPending: isCreating } =
    useCreateService({
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListServicesQueryKey() });
        },
      },
    });
  const { mutateAsync: updateService, isPending: isUpdating } =
    useUpdateServiceById({
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListServicesQueryKey() });
        },
      },
    });

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
        try {
          await createService({
            data: {
              name: values.nome,
              description: values.descricao,
              category: values.categoria,
              type: values.tipo,
              active: values.ativo === "Ativo",
            },
          });
          toast.success("Serviço criado com sucesso!");
          await refetch();
        } catch {
          toast.error("Erro ao criar serviço");
        }
      },
    });
  };

  const handleEdit = (service: Service) => {
    openServiceForm({
      mode: "edit",
      initialValues: {
        nome: service.nome,
        descricao: service.descricao,
        categoria: service.categoria ?? "",
        tipo: service.tipo,
        ativo: service.ativo,
      },
      onSubmit: async (values: ServiceFormValues) => {
        try {
          await updateService({
            id: service.id,
            data: {
              name: values.nome,
              description: values.descricao,
              category: values.categoria,
              type: values.tipo,
              active: values.ativo === "Ativo",
            },
          });
          toast.success("Serviço atualizado com sucesso!");
          await refetch();
        } catch {
          toast.error("Erro ao atualizar serviço");
        }
      },
    });
  };

  const columns: Column<Service>[] = [
    { header: "Nome", accessor: "nome" },
    {
      header: "Tipo",
      accessor: "tipo",
      render: (value) => formatServiceType(value as Service["tipo"]),
    },
    { header: "Descrição", accessor: "descricao" },
    { header: "Detalhe", accessor: "categoria" },
    {
      header: "Status",
      accessor: "ativo",
      render: (value) => <ButtonStatus value={value as string} />,
      align: "center",
    },
  ];

  if (isLoading) {
    return <LoadingState message="Carregando servicos..." />;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-stone-50 p-5 shadow">
        <div>
          <Button
            onClick={handleAdd}
            disabled={isCreating || isUpdating}
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
