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
import { LoadingState } from "@/shared/components/ui/loading-state";
import { ErrorState } from "@/shared/components/ui/error-state";
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
import { PlusIcon } from "@phosphor-icons/react";

const titleClass =
  "text-foreground/70 font-mono text-[10px] tracking-widest uppercase";

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
        <CardTitle className={titleClass}>Feriados e folgas</CardTitle>
        <Button
          onClick={handleCreate}
          variant="editorial"
          size="sm"
          className="gap-2"
        >
          <PlusIcon weight="bold" className="h-4 w-4" />
          Adicionar feriado
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {listQuery.isLoading ? (
          <LoadingState message="Carregando feriados..." size="sm" />
        ) : listQuery.isError ? (
          <ErrorState
            type="error"
            message="Não foi possível carregar os feriados."
          />
        ) : (
          <GenericTable
            data={rows}
            columns={columns}
            rowKey="id"
            emptyMessage="Nenhum feriado cadastrado"
            totalItems={listQuery.data?.total ?? 0}
            showPagination
            className="border-foreground/15 border"
            headerClassName="bg-foreground/[0.04]"
            actions={(row) => (
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => deleteHoliday.mutate({ holidayId: row.id })}
              >
                Remover
              </Button>
            )}
          />
        )}

        <div className="border-foreground/10 flex items-center justify-between border-t pt-4">
          <span className="text-foreground/60 font-mono text-[10px] tracking-widest uppercase">
            Total · {listQuery.data?.total ?? 0} feriado
            {(listQuery.data?.total ?? 0) === 1 ? "" : "s"}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                updateParams({ page: Math.max(1, params.page - 1) })
              }
              disabled={params.page <= 1}
              className="font-mono text-[10px] tracking-widest uppercase"
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateParams({ page: params.page + 1 })}
              disabled={params.page >= (listQuery.data?.totalPages ?? 1)}
              className="font-mono text-[10px] tracking-widest uppercase"
            >
              Próximo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
