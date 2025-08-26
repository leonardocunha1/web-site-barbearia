"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { GenericTable, Column } from "@/components/table/generic-table";
import {
  useCreateProfessional,
  useListOrSearchProfessionals,
  useUpdateProfessional,
  ListOrSearchProfessionals200ProfessionalsItem,
  CreateProfessionalBody,
} from "@/api";
import { toast } from "sonner";
import { ProfessionalStatus } from "./professional-status";
import { useProfessionalFormModal } from "./professional-form-modal";

type Professional = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
};

export function ProfissionalSection() {
  const { data: response, isLoading, refetch } = useListOrSearchProfessionals();
  const { mutateAsync: createProfessional, isPending } = useCreateProfessional();
  const { mutateAsync: updateProfessional } = useUpdateProfessional();
  const { openProfessionalForm } = useProfessionalFormModal();

  const professionals: Professional[] =
    response?.professionals?.map((p: ListOrSearchProfessionals200ProfessionalsItem) => ({
      id: p.id,
      name: p.user.nome,
      email: p.user.email,
      role: p.especialidade,
      status: p.ativo ? "Ativo" : "Inativo",
    })) ?? [];

  const handleAdd = () => {
    openProfessionalForm({
      mode: "create",
      onSubmit: async (values: CreateProfessionalBody & { status: string }) => {
        await createProfessional(
          { data: values },
          {
            onSuccess: () => {
              toast.success("Profissional criado com sucesso!");
              refetch();
            },
            onError: (error) => {
              toast.error(error?.message || "Erro ao criar profissional");
            },
          },
        );
      },
    });
  };

  const handleEdit = (professional: Professional) => {
    openProfessionalForm({
      mode: "edit",
      initialValues: {
        email: professional.email,
        especialidade: professional.role,
        status: professional.status,
      },
      onSubmit: async (values) => {
        await updateProfessional(
          {
            data: { ...values, ativo: values.status === "Ativo" },
            id: professional.id,
          },
          {
            onSuccess: () => {
              toast.success("Profissional atualizado com sucesso!");
              refetch();
            },
            onError: (error) => {
              toast.error(error?.message || "Erro ao atualizar profissional");
            },
          },
        );
      },
    });
  };

  const columns: Column<Professional>[] = [
    { header: "Nome", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Especialidade", accessor: "role" },
    {
      header: "Status",
      accessor: "status",
      render: (value) => <ProfessionalStatus value={value} />,
      align: "center",
    },
  ];

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="border-principal-500 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-t-transparent" />
        <p className="text-principal-600 mt-2 text-sm">Aguarde um momento</p>
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
            Novo Profissional
          </Button>
        </div>
        <GenericTable
          data={professionals}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="Nenhum profissional cadastrado"
          rowKey="id"
          className="rounded-lg border"
          headerClassName="bg-gray-50"
          actions={(row) => (
            <Button variant="outline" size="icon" onClick={() => handleEdit(row)} className="h-8 w-8">
              <Edit className="h-4 w-4" />
            </Button>
          )}
        />
      </Card>
    </div>
  );
}
