"use client";

import { useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  useListProfessionalServices,
  useListOrSearchProfessionals,
} from "@/api";
import ProfessionalServicesTable from "@/features/dashboard/admin/professionals/id/components/professional-service-table";
import { GoBackButton } from "@/shared/components/ui/go-back-button";
import { LoadingState } from "@/shared/components/ui/loading-state";
import { ErrorState } from "@/shared/components/ui/error-state";
import { UserCircleIcon } from "@phosphor-icons/react";

const labelClass =
  "text-foreground/70 font-mono text-[10px] tracking-widest uppercase";

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

  const professionalsQuery = useListOrSearchProfessionals({
    page: 1,
    limit: 100,
  });

  const professional = useMemo(
    () =>
      professionalsQuery.data?.professionals?.find((item) => item.id === id),
    [professionalsQuery.data, id],
  );

  if (isLoading) {
    return (
      <section className="bg-background w-full flex-1 px-6 pt-[124px] pb-16 xl:px-0">
        <div className="mx-auto max-w-7xl">
          <LoadingState message="Carregando serviços..." />
        </div>
      </section>
    );
  }

  if (!data || error) {
    return (
      <section className="bg-background w-full flex-1 px-6 pt-[124px] pb-16 xl:px-0">
        <div className="mx-auto max-w-7xl">
          <ErrorState
            type="error"
            message="Erro ao carregar serviços do profissional."
          />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background w-full flex-1 px-6 pt-[124px] pb-16 xl:px-0">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <GoBackButton
          href="/painel/admin/professionals"
          label="Voltar aos profissionais"
        />

        {/* Header editorial */}
        <header className="border-foreground/15 flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="bg-foreground/60 h-px w-8" aria-hidden />
              <span className="text-foreground/70 font-mono text-[10px] tracking-[0.25em] uppercase">
                Profissional · N° {id.slice(0, 6).toUpperCase()}
              </span>
            </div>
            <div className="flex items-start gap-4">
              <UserCircleIcon
                weight="duotone"
                className="text-cobre-700 h-9 w-9 shrink-0"
              />
              <div className="flex flex-col gap-1">
                <h1 className="font-display text-foreground text-3xl leading-tight font-medium tracking-tight sm:text-4xl">
                  {professional?.user?.name ?? "Profissional"}
                </h1>
                {professional?.specialty && (
                  <p className="text-foreground/70 text-sm sm:text-base">
                    {professional.specialty}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 sm:items-end">
            <span className={labelClass}>Serviços associados</span>
            <span className="font-display text-foreground text-3xl font-medium tracking-tight">
              {String(data.pagination.total ?? 0).padStart(2, "0")}
            </span>
          </div>
        </header>

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
