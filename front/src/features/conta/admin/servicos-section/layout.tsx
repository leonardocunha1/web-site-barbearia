"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { GenericTable, Column } from "@/components/table/generic-table";
import {
  useCreateService,
  useUpdateServiceById,
  useListServices,
  ListServices200ServicesItem,
} from "@/api";
import { toast } from "sonner";
import { useServiceFormModal, ServiceFormValues } from "./services-form-modal";
import { ButtonStatus } from "@/components/table/button-status";

type Service = {
  id: string;
  nome: string;
  descricao?: string;
  categoria?: "Cabelo" | "Barba" | "Cabelo + Barba";
  ativo: "Ativo" | "Inativo";
};

export default function ServicosSection() {
  const { data: response, isLoading, refetch } = useListServices();
  const { mutateAsync: createService, isPending } = useCreateService();
  const { mutateAsync: updateService } = useUpdateServiceById();
  const { openServiceForm } = useServiceFormModal();

  const services: Service[] =
    response?.services?.map((s: ListServices200ServicesItem) => ({
      id: s.id,
      nome: s.nome,
      descricao: s.descricao ?? undefined,
      categoria:
        s.categoria === "completo"
          ? "Cabelo + Barba"
          : s.categoria === "cabelo"
            ? "Cabelo"
            : "Barba",
      ativo: s.ativo ? "Ativo" : "Inativo",
    })) ?? [];

  const handleAdd = () => {
    openServiceForm({
      mode: "create",
      onSubmit: async (values: ServiceFormValues) => {
        await createService(
          {
            data: {
              ...values,
              ativo: values.ativo === "Ativo",
            },
          },
          {
            onSuccess: () => {
              toast.success("Serviço criado com sucesso!");
              refetch();
            },
            onError: (error) => {
              toast.error(error?.message || "Erro ao criar serviço");
            },
          },
        );
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
        await updateService(
          {
            id: service.id,
            data: {
              ...values,
              ativo: values.ativo === "Ativo",
            },
          },
          {
            onSuccess: () => {
              toast.success("Serviço atualizado com sucesso!");
              refetch();
            },
            onError: (error) => {
              toast.error(error?.message || "Erro ao atualizar serviço");
            },
          },
        );
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
            disabled={isPending}
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
