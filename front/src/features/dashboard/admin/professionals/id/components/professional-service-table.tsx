"use client";

import { GenericTable, Column } from "@/shared/components/table/generic-table";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { PencilSimpleIcon } from "@phosphor-icons/react";
import { z } from "zod";
import { zodlistProfessionalServicesResponse } from "@/api";

export type ListProfessionalServicesResponse = z.infer<
  typeof zodlistProfessionalServicesResponse
>;
export type Service = ListProfessionalServicesResponse["services"][number];
export type Pagination = ListProfessionalServicesResponse["pagination"];

interface TableProps {
  data: Service[];
  pagination: Pagination;
  activeOnly: boolean;
  id: string;
}

export default function ProfessionalServicesTable({
  data,
  pagination,
  activeOnly,
  id,
}: TableProps) {
  const router = useRouter();

  const columns: Column<Service>[] = [
    { header: "Nome", accessor: "name" },
    { header: "Descrição", accessor: "description" },
    {
      header: "Categoria",
      accessor: "category",
      render: (value) => value || "—",
    },
  ];

  return (
    <GenericTable
      data={data}
      columns={columns}
      totalItems={pagination.total}
      showPagination
      className="border-foreground/15 border"
      headerClassName="bg-foreground/[0.04]"
      emptyMessage="Nenhum serviço associado"
      actions={(row) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/profissional/${id}/servico/${row.id}`)}
          className="h-8 w-8"
        >
          <PencilSimpleIcon weight="bold" className="h-4 w-4" />
        </Button>
      )}
      showControls
      searchPlaceholder="Buscar serviço..."
      controlsChildren={
        <label className="text-foreground/70 hover:text-foreground flex cursor-pointer items-center gap-2 font-mono text-[10px] tracking-widest uppercase transition-colors">
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={() => {
              router.push(
                `/painel/admin/professionals/${id}?activeOnly=${!activeOnly}`,
              );
            }}
            className="border-foreground/30 text-foreground focus:ring-cobre-500 h-3.5 w-3.5 cursor-pointer"
          />
          Apenas ativos
        </label>
      }
    />
  );
}
