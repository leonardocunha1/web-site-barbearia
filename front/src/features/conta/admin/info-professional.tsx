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
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Professional = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
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
        status: p.ativo ? "Ativo" : "Inativo",
      }),
    ) ?? [];

  const { mutateAsync: createProfessional, isPending } =
    useCreateProfessional();
  const { mutateAsync: updateProfessional } = useUpdateProfessional();

  const schema = z.object({
    email: z.string().email("Email inválido"),
    especialidade: z.string().min(1, "Informe a função"),
    status: z.enum(["Ativo", "Inativo"], {
      errorMap: () => ({ message: "Selecione um status" }),
    }),
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
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "Ativo", label: "Ativo" },
        { value: "Inativo", label: "Inativo" },
      ],
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
          status: professional.status === "Ativo" ? "Ativo" : "Inativo",
        },
        onSubmit: async (
          values: CreateProfessionalBody & { status: string },
        ) => {
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
    {
      header: "Status",
      accessor: "status",
      render: (value) => (
        <Button
          variant={value === "Ativo" ? "default" : "destructive"}
          size="sm"
          className={cn(
            "font-medium transition-all duration-200",
            "min-w-[80px]",
            value === "Ativo"
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-red-500 text-white hover:bg-red-600",
            "shadow-sm hover:shadow-md",
            "rounded-full",
          )}
        >
          <div className="flex items-center justify-center gap-2">
            <div
              className={cn(
                "h-2 w-2 rounded-full",
                value === "Ativo" ? "bg-white" : "bg-white",
              )}
            />
            {value}
          </div>
        </Button>
      ),
      align: "center",
    },
  ];

  if (isLoading)
    return (
      <div className="text-center">
        <div className="border-principal-500 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-t-transparent">
          <span className="sr-only">Carregando...</span>
        </div>
        <p className="text-principal-600 mt-2 text-sm">Aguarde um momento</p>
      </div>
    );

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
