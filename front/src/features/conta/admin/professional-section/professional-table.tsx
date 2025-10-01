"use client";

import { GenericTable, Column } from "@/components/table/generic-table";
import { ButtonStatus } from "@/components/table/button-status";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";

interface Professional {
  id: string;
  name: string;
  email: string;
  role: string;
  ativo: string;
}

interface ProfessionalTableProps {
  professionals: Professional[];
  isLoading?: boolean;
  onEdit: (professional: Professional) => void;
  isEditing?: boolean;
}

export function ProfessionalTable({
  professionals,
  isLoading,
  onEdit,
  isEditing,
}: ProfessionalTableProps) {
  const router = useRouter();

  const columns: Column<Professional>[] = [
    { header: "Nome", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Especialidade", accessor: "role" },
    {
      header: "Status",
      accessor: "ativo",
      render: (value) => <ButtonStatus value={value} />,
      align: "center",
    },
  ];

  return (
    <GenericTable
      data={professionals}
      columns={columns}
      isLoading={isLoading}
      emptyMessage="Nenhum profissional cadastrado"
      rowKey="id"
      onRowClick={(row) => {
        router.push(`conta/admin/professional-section/${row.id}`);
      }}
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
  );
}
