"use client";

import { GenericTable, Column } from "@/components/table/generic-table";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
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
    { header: "Nome", accessor: "nome" },
    { header: "Descrição", accessor: "descricao" },
    {
      header: "Categoria",
      accessor: "categoria",
      render: (value) => value || "—",
    },
  ];

  return (
    <GenericTable
      data={data}
      columns={columns}
      totalItems={pagination.total}
      showPagination
      actions={(row) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/profissional/${id}/servico/${row.id}`)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
      showControls
      searchPlaceholder="Buscar serviço..."
      controlsChildren={
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={() => {
              router.push(
                `/conta/admin/professional-section/${id}?activeOnly=${!activeOnly}`,
              );
            }}
          />
          Apenas ativos
        </label>
      }
    />
  );
}
