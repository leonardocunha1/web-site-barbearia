"use client";

import { Card } from "@/shared/components/ui/card";
import { useEffect } from "react";

import { useProfessionalFormModal } from "../hooks/use-professional-form-modal";
import { LoadingState } from "./loading-state";
import { ProfessionalActions } from "./professional-actions";
import { ProfessionalTable } from "./professional-table";
import { useProfessionalOperations } from "../hooks/use-professional-operations";
import { useProfessionalData } from "../hooks/use-professional-data";
import { useTableParams } from "@/shared/hooks/useTableParams";
import { Professional as ProfessionalType } from "@/app/api/actions/professional";

export function ProfissionalSection() {
  const { params } = useTableParams();
  const { professionals, totalCount, isLoading, error, refetch } =
    useProfessionalData({
      page: params.page,
      limit: params.limit,
      search: params.filters.search,
      status: params.filters.status,
      sortBy: params.sortBy ?? undefined,
      sortDirection: params.sortDirection ?? undefined,
    });

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  const { handleCreate, handleUpdate, isPending } =
    useProfessionalOperations(refetch);
  const { openProfessionalForm } = useProfessionalFormModal();

  const handleAdd = () => {
    openProfessionalForm({
      mode: "create",
      onSubmit: handleCreate,
    });
  };

  const handleEdit = (professional: ProfessionalType) => {
    openProfessionalForm({
      mode: "edit",
      initialValues: {
        email: professional.email,
        especialidade: professional.especialidade,
        ativo: professional.ativo === "Ativo" ? "Ativo" : "Inativo",
      },
      onSubmit: (values) => handleUpdate(professional, values),
    });
  };

  if (isLoading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <Card className="bg-stone-50 p-5 shadow">
        <ProfessionalActions onAdd={handleAdd} isPending={isPending} />
        <ProfessionalTable
          totalCount={totalCount}
          professionals={professionals}
          isLoading={isLoading}
          onEdit={handleEdit}
          isEditing={isPending}
        />
      </Card>
    </div>
  );
}
