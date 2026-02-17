"use client";

import { GenericTable, Column } from "@/shared/components/table/generic-table";
import { ButtonStatus } from "@/shared/components/table/button-status";
import { Button } from "@/shared/components/ui/button";
import { useRouter } from "next/navigation";
import { useTableParams } from "@/shared/hooks/useTableParams";
import { StatusFilter } from "@/shared/components/table/status-filter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { MoreVertical, Edit, Link } from "lucide-react";

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                router.push(`conta/admin/professional-section/${row.id}`)
              }
            >
              <Link className="mr-2 h-4 w-4" />
              Associar Serviços
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onEdit(row);
              }}
              disabled={isEditing}
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
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

