"use client";

import { GenericTable, Column } from "@/components/table/generic-table";
import { ButtonStatus } from "@/components/table/button-status";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { TableControls } from "@/components/table/table-controls";
import { TablePagination } from "@/components/table/table-pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTableParams } from "@/hooks/useTableParams";

interface Professional {
  id: string;
  name: string;
  email: string;
  role: string;
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
  const { params, updateParams } = useTableParams();

  const columns: Column<Professional>[] = [
    {
      header: "Nome",
      accessor: "name",
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Especialidade",
      accessor: "role",
    },
    {
      header: "Status",
      accessor: "ativo",
      render: (value) => <ButtonStatus value={value} />,
      align: "center",
    },
  ];

  const handleStatusFilter = (value: string) => {
    updateParams({
      page: 1,
      filters: {
        ...params.filters,
        status: value,
      },
    });
  };

  const handleSort = (column: keyof Professional) => {
    const newDirection =
      params.sortBy === column && params.sortDirection === "asc"
        ? "desc"
        : "asc";
    updateParams({
      sortBy: column as string,
      sortDirection: newDirection,
    });
  };

  return (
    <div className="space-y-4">
      <TableControls>
        <Select
          value={params.filters.status || ""}
          onValueChange={handleStatusFilter}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </TableControls>

      <GenericTable
        data={professionals}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="Nenhum profissional encontrado"
        rowKey="id"
        onRowClick={(row) => {
          router.push(`conta/admin/professional-section/${row.id}`);
        }}
        // Conectando a ordenação
        sortBy={params.sortBy}
        sortDirection={params.sortDirection}
        onSort={handleSort}
        className="rounded-lg border"
        headerClassName="bg-gray-50"
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
      />

      <TablePagination totalItems={totalCount} className="mt-4" />
    </div>
  );
}
