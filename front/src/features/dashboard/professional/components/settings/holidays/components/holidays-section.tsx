"use client";

import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Column, GenericTable } from "@/shared/components/table/generic-table";
import { useTableParams } from "@/shared/hooks/useTableParams";
import {
  getListHolidaysQueryKey,
  useCreateHoliday,
  useDeleteHoliday,
  useListHolidays,
} from "@/api";
import { useHolidayModal } from "../hooks/use-holiday-modal";
import {
  buildHolidayDateTime,
  formatHolidayDate,
} from "../utils/holiday-formatters";

type HolidayRow = {
  id: string;
  date: string;
  reason: string;
};

export function HolidaysSection() {
  const { params, updateParams } = useTableParams();
  const queryClient = useQueryClient();
  const { openHolidayModal } = useHolidayModal();

  const listParams = {
    page: params.page,
    limit: params.limit,
  };

  const listQuery = useListHolidays(listParams);

  const createHoliday = useCreateHoliday({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getListHolidaysQueryKey(listParams),
        });
        toast.success("Feriado criado com sucesso.");
      },
      onError: () => toast.error("Nao foi possivel criar o feriado."),
    },
  });

  const deleteHoliday = useDeleteHoliday({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getListHolidaysQueryKey(listParams),
        });
        toast.success("Feriado removido.");
      },
      onError: () => toast.error("Nao foi possivel remover o feriado."),
    },
  });

  const rows = useMemo<HolidayRow[]>(() => {
    return (
      listQuery.data?.holidays?.map((holiday) => ({
        id: holiday.id,
        date: formatHolidayDate(holiday.date),
        reason: holiday.reason,
      })) ?? []
    );
  }, [listQuery.data]);

  const columns: Column<HolidayRow>[] = [
    { header: "Data", accessor: "date" },
    { header: "Motivo", accessor: "reason" },
  ];

  const handleCreate = () => {
    openHolidayModal({
      onSubmit: async (values) => {
        await createHoliday.mutateAsync({
          data: {
            date: buildHolidayDateTime(values.date),
            reason: values.reason,
          },
        });
      },
      isSaving: createHoliday.isPending,
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Feriados</CardTitle>
        <Button onClick={handleCreate}>Adicionar feriado</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {listQuery.isLoading ? (
          <p className="text-muted-foreground text-sm">
            Carregando feriados...
          </p>
        ) : listQuery.isError ? (
          <p className="text-sm text-red-600">
            Nao foi possivel carregar os feriados.
          </p>
        ) : (
          <GenericTable
            data={rows}
            columns={columns}
            rowKey="id"
            emptyMessage="Nenhum feriado cadastrado"
            totalItems={listQuery.data?.total ?? 0}
            showPagination
            actions={(row) => (
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600"
                onClick={() => deleteHoliday.mutate({ holidayId: row.id })}
              >
                Remover
              </Button>
            )}
          />
        )}

        <div className="flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            Total de {listQuery.data?.total ?? 0} feriados
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                updateParams({ page: Math.max(1, params.page - 1) })
              }
              disabled={params.page <= 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateParams({ page: params.page + 1 })}
              disabled={params.page >= (listQuery.data?.totalPages ?? 1)}
            >
              Proximo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
