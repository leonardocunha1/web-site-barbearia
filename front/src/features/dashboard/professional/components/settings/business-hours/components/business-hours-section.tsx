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
import { useUser } from "@/contexts/user";
import {
  getListBusinessHoursQueryKey,
  useCreateBusinessHour,
  useDeleteBusinessHour,
  useListBusinessHours,
  useListOrSearchProfessionals,
  useUpdateBusinessHour,
} from "@/api";
import { useBusinessHoursModal } from "../hooks/use-business-hours-modal";
import {
  formatBreakTime,
  formatWeekDay,
} from "../utils/business-hours-formatters";
import type { BusinessHoursFormValues } from "../schemas/business-hours-form-schema";
import { PlusIcon } from "@phosphor-icons/react";

const titleClass =
  "text-foreground/70 font-mono text-[10px] tracking-widest uppercase";

const mapProfessionalId = (
  userId?: string,
  email?: string,
  professionals?: { id: string; user: { id: string; email: string } }[],
) => {
  if (!professionals?.length) return "";
  const byId = professionals.find((item) => item.user.id === userId);
  if (byId) return byId.id;
  const byEmail = professionals.find((item) => item.user.email === email);
  return byEmail?.id ?? "";
};

type BusinessHourRow = {
  id: string;
  dayOfWeek: string;
  opensAt: string;
  closesAt: string;
  break: string;
};

type BusinessHoursSectionProps = {
  professionalId?: string;
};

export function BusinessHoursSection({
  professionalId: professionalIdProp,
}: BusinessHoursSectionProps) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const { openBusinessHoursModal } = useBusinessHoursModal();

  const professionalsQuery = useListOrSearchProfessionals(
    {
      page: 1,
      limit: 50,
      search: user?.user.email,
    },
    {
      query: {
        enabled: !professionalIdProp && Boolean(user?.user.email),
      },
    },
  );

  const professionalId = useMemo(() => {
    if (professionalIdProp) return professionalIdProp;
    return mapProfessionalId(
      user?.user.id,
      user?.user.email,
      professionalsQuery.data?.professionals,
    );
  }, [
    professionalIdProp,
    user?.user.id,
    user?.user.email,
    professionalsQuery.data?.professionals,
  ]);

  const listQuery = useListBusinessHours(professionalId, {
    query: { enabled: Boolean(professionalId) },
  });

  const createBusinessHour = useCreateBusinessHour({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getListBusinessHoursQueryKey(professionalId),
        });
        toast.success("Horario salvo com sucesso.");
      },
      onError: () => toast.error("Nao foi possivel salvar o horario."),
    },
  });

  const updateBusinessHour = useUpdateBusinessHour({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getListBusinessHoursQueryKey(professionalId),
        });
        toast.success("Horario atualizado com sucesso.");
      },
      onError: () => toast.error("Nao foi possivel atualizar o horario."),
    },
  });

  const deleteBusinessHour = useDeleteBusinessHour({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getListBusinessHoursQueryKey(professionalId),
        });
        toast.success("Horario removido.");
      },
      onError: () => toast.error("Nao foi possivel remover o horario."),
    },
  });

  const rows = useMemo<BusinessHourRow[]>(() => {
    return (
      listQuery.data?.businessHours?.map((item) => ({
        id: item.id,
        dayOfWeek: formatWeekDay(item.dayOfWeek),
        opensAt: item.opensAt,
        closesAt: item.closesAt,
        break: formatBreakTime(item.breakStart, item.breakEnd),
      })) ?? []
    );
  }, [listQuery.data]);

  const existingDays = useMemo(
    () => listQuery.data?.businessHours?.map((item) => item.dayOfWeek) ?? [],
    [listQuery.data],
  );

  const columns: Column<BusinessHourRow>[] = [
    { header: "Dia", accessor: "dayOfWeek" },
    { header: "Abertura", accessor: "opensAt" },
    { header: "Fechamento", accessor: "closesAt" },
    { header: "Pausa", accessor: "break" },
  ];

  const handleCreate = () => {
    openBusinessHoursModal({
      mode: "create",
      existingDays,
      onSubmit: async (values: BusinessHoursFormValues) => {
        await createBusinessHour.mutateAsync({ data: values });
      },
      isSaving: createBusinessHour.isPending,
    });
  };

  const handleEdit = (item: BusinessHourRow) => {
    const source = listQuery.data?.businessHours?.find(
      (entry) => entry.id === item.id,
    );

    openBusinessHoursModal({
      mode: "edit",
      existingDays,
      initialValues: source
        ? {
            dayOfWeek: source.dayOfWeek,
            opensAt: source.opensAt,
            closesAt: source.closesAt,
            breakStart: source.breakStart ?? "",
            breakEnd: source.breakEnd ?? "",
          }
        : undefined,
      onSubmit: async (values: BusinessHoursFormValues) => {
        if (!professionalId) return;
        await updateBusinessHour.mutateAsync({
          professionalId,
          data: values,
        });
      },
      isSaving: updateBusinessHour.isPending,
    });
  };

  if (!professionalIdProp && professionalsQuery.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className={titleClass}>Horários de funcionamento</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingState
            message="Carregando dados do profissional..."
            size="sm"
          />
        </CardContent>
      </Card>
    );
  }

  if (!professionalId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className={titleClass}>Horários de funcionamento</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorState
            type="warning"
            message="Não foi possível identificar o profissional logado."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className={titleClass}>Horários de funcionamento</CardTitle>
        <Button
          onClick={handleCreate}
          variant="editorial"
          size="sm"
          className="gap-2"
        >
          <PlusIcon weight="bold" className="h-4 w-4" />
          Adicionar horário
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {listQuery.isLoading ? (
          <LoadingState message="Carregando horarios..." size="sm" />
        ) : listQuery.isError ? (
          <ErrorState
            type="error"
            message="Não foi possível carregar os horários."
          />
        ) : (
          <GenericTable
            data={rows}
            columns={columns}
            rowKey="id"
            emptyMessage="Nenhum horário cadastrado"
            className="border-foreground/15 border"
            headerClassName="bg-foreground/[0.04]"
            actions={(row) => (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(row)}
                >
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() =>
                    deleteBusinessHour.mutate({ businessHoursId: row.id })
                  }
                >
                  Remover
                </Button>
              </div>
            )}
          />
        )}
      </CardContent>
    </Card>
  );
}
