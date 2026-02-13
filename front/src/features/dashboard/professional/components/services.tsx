"use client";

import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useUser } from "@/contexts/user";
import {
  getListProfessionalServicesQueryKey,
  useAddServiceToProfessional,
  useListOrSearchProfessionals,
  useListProfessionalServices,
  useRemoveServiceFromProfessional,
  useUpdateServiceProfessional,
} from "@/api";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Column, GenericTable } from "@/shared/components/table/generic-table";

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

const formatCurrency = (value?: number | null) => {
  if (value == null) return "-";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const formatDuration = (value?: number | null) =>
  value != null ? `${value} min` : "-";

type ServiceRow = {
  id: string;
  name: string;
  duration: number | null;
  price: number | null;
  category: string | null;
  active: boolean;
  linked: boolean;
};

type DialogState = {
  open: boolean;
  mode: "link" | "edit";
  service?: ServiceRow;
};

export function ServicesSection() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [dialogState, setDialogState] = useState<DialogState>({
    open: false,
    mode: "link",
  });
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");

  const professionalsQuery = useListOrSearchProfessionals({
    page: 1,
    limit: 50,
    search: user?.user.email,
  });

  const professionalId = useMemo(
    () =>
      mapProfessionalId(
        user?.user.id,
        user?.user.email,
        professionalsQuery.data?.professionals,
      ),
    [user?.user.id, user?.user.email, professionalsQuery.data?.professionals],
  );

  const listParams = useMemo(
    () => ({ page: 1, limit: 100, activeOnly: true }),
    [],
  );

  const listQuery = useListProfessionalServices(professionalId, listParams, {
    query: { enabled: Boolean(professionalId) },
  });

  const addService = useAddServiceToProfessional({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getListProfessionalServicesQueryKey(
            professionalId,
            listParams,
          ),
        });
        toast.success("Servico vinculado com sucesso.");
        setDialogState({ open: false, mode: "link" });
      },
      onError: () => toast.error("Nao foi possivel vincular o servico."),
    },
  });

  const updateService = useUpdateServiceProfessional({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getListProfessionalServicesQueryKey(
            professionalId,
            listParams,
          ),
        });
        toast.success("Servico atualizado com sucesso.");
        setDialogState({ open: false, mode: "link" });
      },
      onError: () => toast.error("Nao foi possivel atualizar o servico."),
    },
  });

  const removeService = useRemoveServiceFromProfessional({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getListProfessionalServicesQueryKey(
            professionalId,
            listParams,
          ),
        });
        toast.success("Servico removido.");
      },
      onError: () => toast.error("Nao foi possivel remover o servico."),
    },
  });

  useEffect(() => {
    if (!dialogState.open || !dialogState.service) return;
    setPrice(
      dialogState.service.price != null
        ? String(dialogState.service.price)
        : "",
    );
    setDuration(
      dialogState.service.duration != null
        ? String(dialogState.service.duration)
        : "",
    );
  }, [dialogState]);

  const rows = useMemo<ServiceRow[]>(() => {
    return (
      listQuery.data?.services?.map((service) => ({
        id: service.id,
        name: service.name,
        duration: service.duration ?? null,
        price: service.price ?? null,
        category: service.category ?? "-",
        active: service.active,
        linked: service.price != null && service.duration != null,
      })) ?? []
    );
  }, [listQuery.data]);

  const columns: Column<ServiceRow>[] = [
    { header: "Servico", accessor: "name" },
    {
      header: "Duracao",
      accessor: "duration",
      render: (value) => formatDuration(value as number | null),
      align: "center",
    },
    {
      header: "Preco",
      accessor: "price",
      render: (value) => formatCurrency(value as number | null),
      align: "center",
    },
    {
      header: "Categoria",
      accessor: "category",
      render: (value) => <Badge variant="outline">{value}</Badge>,
    },
    {
      header: "Status",
      accessor: "linked",
      render: (value, row) => (
        <Badge
          variant={value ? "default" : "secondary"}
          className={!row.active ? "opacity-60" : undefined}
        >
          {value ? "Vinculado" : "Nao vinculado"}
        </Badge>
      ),
    },
  ];

  const openDialog = (mode: "link" | "edit", service: ServiceRow) => {
    setDialogState({ open: true, mode, service });
  };

  const handleSave = async () => {
    if (!dialogState.service || !professionalId) return;

    const parsedPrice = Number(price);
    const parsedDuration = Number(duration);

    if (
      !parsedPrice ||
      parsedPrice <= 0 ||
      !parsedDuration ||
      parsedDuration <= 0
    ) {
      toast.error("Informe preco e duracao validos.");
      return;
    }

    if (parsedDuration % 15 !== 0) {
      toast.error("A duracao deve ser multipla de 15 minutos.");
      return;
    }

    if (dialogState.mode === "link") {
      await addService.mutateAsync({
        professionalId,
        data: {
          serviceId: dialogState.service.id,
          price: parsedPrice,
          duration: parsedDuration,
        },
      });
      return;
    }

    await updateService.mutateAsync({
      professionalId,
      data: {
        services: [
          {
            serviceId: dialogState.service.id,
            price: parsedPrice,
            duration: parsedDuration,
            linked: true,
          },
        ],
      },
    });
  };

  if (professionalsQuery.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meus Servicos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Carregando dados do profissional...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!professionalId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meus Servicos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Nao foi possivel identificar o profissional logado.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meus Servicos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {listQuery.isLoading ? (
          <p className="text-muted-foreground text-sm">
            Carregando servicos...
          </p>
        ) : listQuery.isError ? (
          <p className="text-sm text-red-600">
            Nao foi possivel carregar os servicos.
          </p>
        ) : (
          <GenericTable
            data={rows}
            columns={columns}
            rowKey="id"
            emptyMessage="Nenhum servico disponivel"
            actions={(row) => (
              <div className="flex items-center gap-2">
                {row.linked ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDialog("edit", row)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600"
                      onClick={() =>
                        removeService.mutate({
                          professionalId,
                          serviceId: row.id,
                        })
                      }
                    >
                      Desvincular
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDialog("link", row)}
                    disabled={!row.active}
                  >
                    Vincular
                  </Button>
                )}
              </div>
            )}
          />
        )}
      </CardContent>

      <Dialog
        open={dialogState.open}
        onOpenChange={(open) => setDialogState((prev) => ({ ...prev, open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogState.mode === "link"
                ? "Vincular servico"
                : "Editar servico"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">{dialogState.service?.name}</p>
              <p className="text-muted-foreground text-xs">
                {dialogState.service?.category}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Preco</Label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Duracao (min)</Label>
                <Input
                  type="number"
                  min={15}
                  step={15}
                  value={duration}
                  onChange={(event) => setDuration(event.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleSave}
              disabled={
                addService.isPending ||
                updateService.isPending ||
                !dialogState.service
              }
            >
              {addService.isPending || updateService.isPending
                ? "Salvando..."
                : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
