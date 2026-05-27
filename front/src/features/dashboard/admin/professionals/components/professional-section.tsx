"use client";

import { Card } from "@/shared/components/ui/card";

import { useProfessionalFormModal } from "../hooks/use-professional-form-modal";
import { LoadingState } from "@/shared/components/ui/loading-state";
import { ProfessionalActions } from "./professional-actions";
import { ProfessionalTable } from "./professional-table";
import { useProfessionalOperations } from "../hooks/use-professional-operations";
import {
  Professional as ProfessionalType,
  useProfessionalData,
} from "../hooks/use-professional-data";
import { useTableParams } from "@/shared/hooks/useTableParams";
import { ListOrSearchProfessionalsStatus } from "@/api";

export function ProfessionalSection() {
  const { params } = useTableParams();
  const { professionals, totalCount, isLoading, refetch } =
    useProfessionalData({
      page: params.page,
      limit: params.limit,
      search: params.filters.search,
      status: params.filters.status as ListOrSearchProfessionalsStatus,
      sortBy: params.sortBy ?? undefined,
      sortDirection: params.sortDirection ?? undefined,
    });

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
        name: professional.name,
        email: professional.email,
        phone: professional.phone ?? "",
        specialty: professional.specialty,
        status: professional.status === "Active" ? "active" : "inactive",
      },
      onSubmit: (values) => handleUpdate(professional, values),
    });
  };

  if (isLoading) return <LoadingState message="Aguarde um momento" />;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-foreground/70 font-mono text-[10px] tracking-widest uppercase">
          Funcionários
        </p>
        <h2 className="font-display text-foreground text-2xl font-medium tracking-tight">
          Profissionais cadastrados
        </h2>
      </div>
      <Card className="space-y-5 p-5">
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
