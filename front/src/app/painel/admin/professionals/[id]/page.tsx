"use client";

import { useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useListProfessionalServices } from "@/api";
import ProfessionalServicesTable from "@/features/dashboard/admin/professionals/id/components/professional-service-table";
import { GoBackButton } from "@/shared/components/ui/go-back-button";
import { LoadingState } from "@/shared/components/ui/loading-state";
import { ErrorState } from "@/shared/components/ui/error-state";

export default function ProfessionalPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const id = typeof params.id === "string" ? params.id : params.id?.[0] ?? "";

  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "10");
  const activeOnly = searchParams.get("activeOnly") === "true";

  const listParams = useMemo(
    () => ({ page, limit, activeOnly }),
    [page, limit, activeOnly],
  );

  const { data, isLoading, error } = useListProfessionalServices(
    id,
    listParams,
    { query: { enabled: Boolean(id) } },
  );

  if (isLoading) {
    return <LoadingState message="Carregando servicos..." />;
  }

  if (!data || error) {
    return (
      <ErrorState
        type="error"
        message="Erro ao carregar servicos do profissional."
      />
    );
  }

  return (
    <section className="w-full flex-1 bg-stone-100 px-6 pt-[124px] pb-16 xl:px-0">
      <div className="mx-auto max-w-7xl">
        <GoBackButton href="/painel/admin/professionals" />

        <h1 className="mt-4 mb-4 text-2xl font-bold">
          Servicos do Profissional {id}
        </h1>

        <ProfessionalServicesTable
          data={data.services}
          pagination={data.pagination}
          activeOnly={activeOnly}
          id={id}
        />
      </div>
    </section>
  );
}
