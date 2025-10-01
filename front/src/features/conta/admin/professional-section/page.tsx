"use client";

import { Card } from "@/components/ui/card";

import { useProfessionalFormModal } from "./professional-form-modal";
import { LoadingState } from "./loading-state";
import { ProfessionalActions } from "./professional-actions";
import { ProfessionalTable } from "./professional-table";
import { useProfessionalOperations } from "./use-professional-operations";
import { useProfessionalData } from "./use-professional-data";

type Professional = {
  id: string;
  name: string;
  email: string;
  role: string;
  ativo: string;
};

export function ProfissionalSection() {
  const { professionals, isLoading, refetch } = useProfessionalData();
  const { handleCreate, handleUpdate, isPending } =
    useProfessionalOperations(refetch);
  const { openProfessionalForm } = useProfessionalFormModal();

  const handleAdd = () => {
    openProfessionalForm({
      mode: "create",
      onSubmit: handleCreate,
    });
  };

  const handleEdit = (professional: Professional) => {
    openProfessionalForm({
      mode: "edit",
      initialValues: {
        email: professional.email,
        especialidade: professional.role,
        ativo: professional.ativo === "Ativo" ? "Ativo" : "Inativo",
      },
      onSubmit: (values) => handleUpdate(professional, values),
    });
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-stone-50 p-5 shadow">
        <ProfessionalActions onAdd={handleAdd} isPending={isPending} />
        <ProfessionalTable
          professionals={professionals}
          isLoading={isLoading}
          onEdit={handleEdit}
          isEditing={isPending}
        />
      </Card>
    </div>
  );
}
