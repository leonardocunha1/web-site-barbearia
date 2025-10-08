"use client";

import { Card } from "@/components/ui/card";
import { useEffect, useState, useCallback } from "react";

import { useProfessionalFormModal } from "./professional-form-modal";
import { LoadingState } from "./loading-state";
import { ProfessionalActions } from "./professional-actions";
import { ProfessionalTable } from "./professional-table";
import { useProfessionalOperations } from "./use-professional-operations";
import { useTableParams } from "@/hooks/useTableParams";
import {
  professionalsList,
  Professional as ProfessionalType,
} from "@/app/api/actions/professional";

export function ProfissionalSection() {
  const { params } = useTableParams();
  const [professionals, setProfessionals] = useState<ProfessionalType[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfessionals = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, ok, error } = await professionalsList({
        page: params.page,
        limit: params.limit,
        search: params.filters.search,
        status: params.filters.status,
        sortBy: params.sortBy ?? undefined,
        sortDirection: params.sortDirection ?? undefined,
      });

      if (ok && data) {
        setProfessionals(data.professionals);
        setTotalCount(data.total);
      } else {
        console.error(error || "Erro ao carregar profissionais");
      }
    } catch (err) {
      console.error((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [
    params.page,
    params.limit,
    params.filters.search,
    params.filters.status,
    params.sortBy,
    params.sortDirection,
  ]);

  useEffect(() => {
    fetchProfessionals();
  }, [fetchProfessionals]);

  const { handleCreate, handleUpdate, isPending } =
    useProfessionalOperations(fetchProfessionals);
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
