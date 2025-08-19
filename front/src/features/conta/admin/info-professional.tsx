"use client";

import { Column, GenericTable } from "@/components/table/generic-table";
import { Card } from "@/components/ui/card";
import { useOverlay } from "@/hooks/useOverlay";
import { z } from "zod";
import { FormField } from "@/components/form/types";
import {
  useCreateProfessional,
  useListOrSearchProfessionals,
  ListOrSearchProfessionals200ProfessionalsItem,
  CreateProfessionalBody,
  useUpdateProfessional,
} from "@/api";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogDemo } from "./teste";

type Professional = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export function InfoProfissionalSection() {
  const { data: response, isLoading, refetch } = useListOrSearchProfessionals();
  const { open } = useOverlay();

  const professionals: Professional[] =
    response?.professionals?.map(
      (p: ListOrSearchProfessionals200ProfessionalsItem) => ({
        id: p.id,
        name: p.user.nome,
        email: p.user.email,
        role: p.especialidade,
      }),
    ) ?? [];

  const { mutateAsync: createProfessional, isPending } =
    useCreateProfessional();
  const { mutateAsync: updateProfessional } = useUpdateProfessional();

  const schema = z.object({
    email: z.string().email("Email inválido"),
    especialidade: z.string().min(1, "Informe a função"),
  });

  const fields: FormField[] = [
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Digite o email",
    },
    {
      name: "especialidade",
      label: "Especialidade",
      type: "text",
      placeholder: "Digite a especialidade",
    },
  ];

  const handleAdd = () => {
    open(
      {
        schema,
        fields,
        defaultButton: true,
        buttonText: isPending ? "Enviando..." : "Adicionar",
        resetAfterSubmit: true,
        onSubmit: async (values: CreateProfessionalBody) => {
          try {
            await createProfessional({ data: values });
            refetch();
          } catch (error) {
            console.error("Erro ao criar profissional:", error);
            throw error;
          }
        },
      },
      {
        type: "form",
        renderAs: "modal",
        title: "Adicionar Profissional",
      },
    );
  };

  const handleEdit = (professional: Professional) => {
    open(
      {
        schema,
        fields,
        defaultButton: true,
        buttonText: "Salvar",
        initialValues: {
          email: professional.email,
          especialidade: professional.role,
        },
        onSubmit: async (values: CreateProfessionalBody) => {
          try {
            await updateProfessional({ data: values, id: professional.id });
            refetch();
            // Remove o close() direto aqui - será tratado pelo onSuccess no ModalPortal
          } catch (error) {
            console.error("Erro ao editar profissional:", error);
            throw error;
          }
        },
      },
      {
        type: "form",
        renderAs: "modal",
        title: "Editar Profissional",
      },
    );
  };

  const columns: Column<Professional>[] = [
    { header: "Nome", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Especialidade", accessor: "role" },
  ];

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      <Card className="p-5 shadow">
        <div className="mb-4">
          <Button
            onClick={handleAdd}
            disabled={isPending}
            className="bg-blue-500 text-white hover:bg-blue-600"
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
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleEdit(row)}
                className="h-8 w-8"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          )}
        />
      </Card>

      <DialogDemo />
    </div>
  );
}
