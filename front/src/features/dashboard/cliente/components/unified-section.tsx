"use client";

import { useMemo, useState } from "react";
import { differenceInMinutes, parseISO } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { LoadingState } from "@/shared/components/ui/loading-state";
import { ErrorState } from "@/shared/components/ui/error-state";
import { CalendarIcon, UserIcon, Info } from "lucide-react";
import { Column, GenericTable } from "@/shared/components/table/generic-table";
import { StatusBadge } from "@/shared/components/table/status-badge";
import { Button } from "@/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import {
  useListUserBookings,
  useCancelUserBooking,
  ListUserBookingsStatus,
  useGetBonusBalance,
} from "@/api";
import {
  buildDateRangeFilters,
  formatBookingDateTime,
  formatBookingServices,
  formatBookingStatus,
} from "@/features/bookings/utils/booking-formatters";
import { useTableParams } from "@/shared/hooks/useTableParams";
import { BookingFilters } from "@/features/bookings";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNextBooking, useUserBookings } from "../hooks/use-user-bookings";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

type ReservationRow = {
  id: string;
  date: string;
  time: string;
  service: string;
  barber: string;
  status: string;
  statusValue: "PENDING" | "CONFIRMED" | "CANCELED" | "COMPLETED";
  startDateTime: string;
};

const formatCurrency = (value?: number) => {
  if (value == null) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export function UnifiedClientSection() {
  const { data: bonus } = useGetBonusBalance();
  const { data: bookingsData } = useUserBookings(10);
  const nextBooking = useNextBooking();
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  const nextDateTime = formatBookingDateTime(nextBooking?.startDateTime);
  const nextServices = formatBookingServices(nextBooking?.items);
  const totalBookings = bookingsData?.total ?? 0;

  const points = bonus?.points;
  const monetaryValue = bonus?.monetaryValue;

  // Reservations logic
  const { params, updateParams } = useTableParams();
  const queryClient = useQueryClient();
  const cancelBooking = useCancelUserBooking({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/bookings/me"] });
        toast.success("Agendamento cancelado com sucesso.");
        setBookingToCancel(null);
      },
      onError: () => {
        toast.error("Não foi possível cancelar o agendamento.");
        setBookingToCancel(null);
      },
    },
  });

  const { startDate, endDate } = buildDateRangeFilters(
    params.filters.startDate,
    params.filters.endDate,
  );

  const listParams = {
    page: params.page,
    limit: params.limit,
    status: params.filters.status
      ? (params.filters.status as ListUserBookingsStatus)
      : undefined,
    startDate,
    endDate,
  };

  const { data, isLoading, isError } = useListUserBookings(listParams);

  const reservations = useMemo<ReservationRow[]>(() => {
    return (
      data?.bookings?.map((booking) => {
        const { date, time } = formatBookingDateTime(booking.startDateTime);

        return {
          id: booking.id,
          date,
          time,
          service: formatBookingServices(booking.items),
          barber: booking.professional?.user?.name ?? "-",
          status: formatBookingStatus(booking.status),
          statusValue: booking.status,
          startDateTime: booking.startDateTime,
        };
      }) ?? []
    );
  }, [data]);

  const canCancelBooking = (row: ReservationRow) => {
    if (row.statusValue !== "PENDING") return false;
    const minutesToStart = differenceInMinutes(
      parseISO(row.startDateTime),
      new Date(),
    );
    return minutesToStart >= 120;
  };

  const columns: Column<ReservationRow>[] = [
    { header: "Data", accessor: "date" },
    { header: "Horário", accessor: "time" },
    { header: "Serviço", accessor: "service" },
    { header: "Barbeiro", accessor: "barber" },
    {
      header: "Status",
      accessor: "status",
      render: (value) => <StatusBadge status={value} />,
      align: "center",
      width: "120px",
    },
  ];

  const handleCancelClick = (bookingId: string) => {
    setBookingToCancel(bookingId);
  };

  const handleConfirmCancel = () => {
    if (bookingToCancel) {
      cancelBooking.mutateAsync({
        bookingId: bookingToCancel,
        data: {},
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="w-full rounded-2xl shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Próximo Agendamento
            </CardTitle>
            <CalendarIcon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {nextBooking ? `${nextDateTime.date}, ${nextDateTime.time}` : "-"}
            </div>
            <p className="text-muted-foreground text-xs">
              {nextBooking ? nextServices : "Sem agendamento"}
            </p>
          </CardContent>
        </Card>

        <Card className="w-full rounded-2xl shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Visitas Totais
            </CardTitle>
            <UserIcon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-muted-foreground text-xs">
              Agendamentos realizados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Pontuação */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Meus Pontos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="rounded-lg border p-4 text-center">
                <p className="text-muted-foreground text-sm">Total</p>
                <p className="text-4xl font-bold">{points?.totalPoints ?? 0}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-1.5">
                    <p className="text-muted-foreground text-xs">
                      Agendamentos
                    </p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="text-muted-foreground h-3.5 w-3.5 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[200px]">
                        <p className="text-xs">
                          Ganhe 1 ponto a cada R$ 10,00 gastos em agendamentos.
                          Cada ponto vale R$ 0,50 em desconto.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-lg font-semibold">
                    {points?.bookingPoints ?? 0}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-1.5">
                    <p className="text-muted-foreground text-xs">Fidelidade</p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="text-muted-foreground h-3.5 w-3.5 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[200px]">
                        <p className="text-xs">
                          Ganhe 2 pontos de fidelidade a cada 5 agendamentos
                          concluídos. Pontos expiram em 6 meses.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-lg font-semibold">
                    {points?.loyaltyPoints ?? 0}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Valor em Bônus</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="rounded-lg border p-4 text-center">
                <p className="text-muted-foreground text-sm">Total</p>
                <p className="text-3xl font-bold">
                  {formatCurrency(monetaryValue?.totalValue)}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border p-3">
                  <p className="text-muted-foreground text-xs">Agendamentos</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(monetaryValue?.bookingValue)}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-muted-foreground text-xs">Fidelidade</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(monetaryValue?.loyaltyValue)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Reservas */}
      <Card>
        <CardHeader>
          <CardTitle>Minhas Reservas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <BookingFilters
            value={{
              status: params.filters.status,
              startDate: params.filters.startDate,
              endDate: params.filters.endDate,
            }}
            onChange={(next) =>
              updateParams({
                page: 1,
                filters: {
                  ...params.filters,
                  status: next.status ?? "",
                  startDate: next.startDate ?? "",
                  endDate: next.endDate ?? "",
                },
              })
            }
          />

          {isLoading ? (
            <LoadingState message="Carregando reservas..." size="sm" />
          ) : isError ? (
            <ErrorState
              type="error"
              message="Nao foi possivel carregar suas reservas."
            />
          ) : (
            <GenericTable
              data={reservations}
              columns={columns}
              rowKey="id"
              emptyMessage="Nenhuma reserva encontrada"
              totalItems={data?.total ?? 0}
              showPagination
              actions={(row) => {
                const isCancelable = canCancelBooking(row);
                const minutesToStart = differenceInMinutes(
                  parseISO(row.startDateTime),
                  new Date(),
                );

                const handleClick = () => {
                  if (isCancelable && !cancelBooking.isPending) {
                    handleCancelClick(row.id);
                  }
                };

                return (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant={isCancelable ? "outline" : "ghost"}
                        onClick={handleClick}
                        className={
                          !isCancelable ? "cursor-not-allowed opacity-60" : ""
                        }
                      >
                        Cancelar
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[250px]">
                      {isCancelable ? (
                        <p className="text-xs">
                          Cancelar este agendamento. A ação não pode ser
                          desfeita.
                        </p>
                      ) : row.statusValue !== "PENDING" ? (
                        <p className="text-xs">
                          Não é possível cancelar agendamentos que já foram
                          confirmados, concluídos ou cancelados.
                        </p>
                      ) : (
                        <div className="space-y-1 text-xs">
                          <p className="font-semibold">
                            Cancelamento não permitido
                          </p>
                          <p>
                            O cancelamento online é permitido apenas com no
                            mínimo 2 horas de antecedência.
                          </p>
                          <p>
                            {minutesToStart > 0
                              ? `Você tem ${Math.floor(minutesToStart / 60)}h ${minutesToStart % 60}min. Faltam ${120 - minutesToStart} minutos.`
                              : "O agendamento já começou."}
                          </p>
                          <p className="pt-1 font-semibold">
                            Para cancelar, entre em contato conosco pelo
                            telefone.
                          </p>
                        </div>
                      )}
                    </TooltipContent>
                  </Tooltip>
                );
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Modal de Confirmação de Cancelamento */}
      <Dialog
        open={!!bookingToCancel}
        onOpenChange={(open: boolean) => !open && setBookingToCancel(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Cancelamento</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar este agendamento? Esta ação não
              pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setBookingToCancel(null)}
              disabled={cancelBooking.isPending}
            >
              Voltar
            </Button>
            <Button
              onClick={handleConfirmCancel}
              disabled={cancelBooking.isPending}
              variant="destructive"
            >
              {cancelBooking.isPending ? "Cancelando..." : "Sim, cancelar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
