"use client";

import { GenericTable, Column } from "@/components/table/generic-table";
import { ButtonStatus } from "@/components/table/button-status";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTableParams } from "@/hooks/useTableParams";
import { StatusFilter } from "@/components/table/status-filter";

interface Professional {
  id: string;
  name: string;
  email: string;
  especialidade: string;
  ativo: string;
}

interface ProfessionalTableProps {
  professionals: Professional[];
  totalCount: number;
  isLoading?: boolean;
  onEdit: (professional: Professional) => void;
  isEditing?: boolean;
}

export function ProfessionalTable({
  professionals,
  totalCount,
  isLoading,
  onEdit,
  isEditing,
}: ProfessionalTableProps) {
  const router = useRouter();
  const { params, updateParams, clearSorting } = useTableParams();

  const columns: Column<Professional>[] = [
    { header: "Nome", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Especialidade", accessor: "especialidade" },
    {
      header: "Status",
      accessor: "ativo",
      render: (value) => <ButtonStatus value={value} />,
      align: "center",
    },
  ];

  return (
    <GenericTable
      currentSort={params.sortBy as keyof Professional | null}
      currentSortDirection={params.sortDirection}
      data={professionals}
      columns={columns}
      totalItems={totalCount}
      isLoading={isLoading}
      rowKey="id"
      showControls
      showPagination
      searchPlaceholder="Buscar profissional..."
      onSearch={(value) =>
        updateParams({
          page: 1,
          filters: { ...params.filters, search: value },
        })
      }
      controlsChildren={
        <StatusFilter
          value={params.filters.status ?? ""}
          className="w-full sm:w-32"
          onChange={(value) =>
            updateParams({
              page: 1,
              filters: { ...params.filters, status: value ?? "" },
            })
          }
        />
      }
      actions={(row) => (
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(row);
          }}
          disabled={isEditing}
          className="h-8 w-8"
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
      onRowClick={(row) =>
        router.push(`conta/admin/professional-section/${row.id}`)
      }
      onSort={(column, direction) => {
        if (!column || !direction) {
          clearSorting();
        } else {
          updateParams({ sortBy: column as string, sortDirection: direction });
        }
      }}
    />
  );
}
