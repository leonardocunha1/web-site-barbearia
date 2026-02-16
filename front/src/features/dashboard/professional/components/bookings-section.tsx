"use client";

import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Column, GenericTable } from "@/shared/components/table/generic-table";
import { StatusBadge } from "@/shared/components/table/status-badge";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  useListProfessionalBookings,
  useUpdateBookingStatus,
  getListProfessionalBookingsQueryKey,
} from "@/api/react-query/bookings";
import {
  ListProfessionalBookings200BookingsItem,
  ListProfessionalBookingsStatus,
  UpdateBookingStatusBodyStatus,
} from "@/api";
import {
  formatBookingDateTime,
  formatBookingServices,
  formatBookingStatus,
} from "@/features/bookings/utils/booking-formatters";
import { useTableParams } from "@/shared/hooks/useTableParams";
import { BookingFilters } from "@/features/bookings";
import { toast } from "sonner";

type BookingRow = {
  id: string;
  date: string;
  time: string;
  service: string;
  client: string;
  status: string;
  statusValue: "PENDING" | "CONFIRMED" | "CANCELED" | "COMPLETED";
  startDateTime: string;
  totalAmount: number;
  endDateTime: string;
};

export function BookingsSection() {
  const { params, updateParams } = useTableParams();
  const queryClient = useQueryClient();
  const [bookingToUpdate, setBookingToUpdate] = useState<BookingRow | null>(
    null,
  );
  const [newStatus, setNewStatus] = useState<
    UpdateBookingStatusBodyStatus | ""
  >("");
  const updateBookingStatus = useUpdateBookingStatus();

  const parsedStatus = useMemo(() => {
    const current = params.filters.status || undefined;
    if (!current) return undefined;
    return (Object.values(ListProfessionalBookingsStatus) as string[]).includes(
      current,
    )
      ? (current as ListProfessionalBookingsStatus)
      : undefined;
  }, [params.filters.status]);

  const { data, isLoading, isError } = useListProfessionalBookings(
    {
      page: params.page,
      limit: params.limit,
      status: parsedStatus,
    },
    {},
  );

  const bookings = useMemo<BookingRow[]>(() => {
    return (
      data?.bookings?.map(
        (booking: ListProfessionalBookings200BookingsItem) => {
          const { date, time } = formatBookingDateTime(booking.startDateTime);

          return {
            id: booking.id,
            date,
            time,
            service: formatBookingServices(booking.items),
            client: booking.user?.name ?? "-",
            status: formatBookingStatus(booking.status),
            statusValue: booking.status,
            startDateTime: booking.startDateTime,
            endDateTime: booking.endDateTime,
            totalAmount: booking.totalAmount ?? 0,
          };
        },
      ) ?? []
    );
  }, [data]);

  const canComplete = (row: BookingRow) => {
    const endTime = new Date(row.endDateTime);
    return endTime <= new Date();
  };

  const statusOptionsByCurrent: Record<
    BookingRow["statusValue"],
    { value: UpdateBookingStatusBodyStatus; label: string }[]
  > = {
    PENDING: [
      { value: "CONFIRMED", label: "Confirmado" },
      { value: "CANCELED", label: "Cancelado" },
    ],
    CONFIRMED: [
      { value: "COMPLETED", label: "Concluido" },
      { value: "CANCELED", label: "Cancelado" },
    ],
    CANCELED: [],
    COMPLETED: [],
  };

  const availableStatusOptions = bookingToUpdate
    ? statusOptionsByCurrent[bookingToUpdate.statusValue].filter((option) =>
        option.value === "COMPLETED" ? canComplete(bookingToUpdate) : true,
      )
    : [];

  const handleStatusUpdate = async () => {
    if (!bookingToUpdate || !newStatus) return;

    try {
      await updateBookingStatus.mutateAsync({
        bookingId: bookingToUpdate.id,
        data: { status: newStatus },
      });

      toast.success("Status atualizado com sucesso!");
      setBookingToUpdate(null);
      setNewStatus("");

      queryClient.invalidateQueries({
        queryKey: getListProfessionalBookingsQueryKey({
          page: params.page,
          limit: params.limit,
          status: parsedStatus,
        }),
      });
    } catch {
      toast.error("Erro ao atualizar status");
    }
  };

  const columns: Column<BookingRow>[] = [
    { header: "Data", accessor: "date" },
    { header: "Horário", accessor: "time" },
    { header: "Cliente", accessor: "client" },
    { header: "Serviço", accessor: "service" },
    {
      header: "Valor",
      accessor: "totalAmount",
      render: (value) => `R$ ${Number(value ?? 0).toFixed(2)}`,
    },
    {
      header: "Status",
      accessor: "status",
      render: (value) => <StatusBadge status={String(value)} />,
      align: "center",
      width: "120px",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meus Agendamentos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <BookingFilters
          value={{
            status: params.filters.status,
            startDate: "",
            endDate: "",
          }}
          onChange={(next) =>
            updateParams({
              page: 1,
              filters: {
                ...params.filters,
                status: next.status ?? "",
              },
            })
          }
        />

        {isLoading ? (
          <div className="text-sm text-stone-500">
            Carregando agendamentos...
          </div>
        ) : isError ? (
          <div className="text-sm text-red-600">
            Não foi possível carregar agendamentos.
          </div>
        ) : (
          <GenericTable
            data={bookings}
            columns={columns}
            rowKey="id"
            emptyMessage="Nenhum agendamento encontrado"
            totalItems={data?.total ?? 0}
            showPagination
            actions={(row) => (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setBookingToUpdate(row);
                  setNewStatus("");
                }}
                disabled={
                  row.statusValue === "CANCELED" ||
                  row.statusValue === "COMPLETED"
                }
              >
                Mudar Status
              </Button>
            )}
          />
        )}
      </CardContent>

      {/* Dialog para alterar status */}
      <Dialog
        open={!!bookingToUpdate}
        onOpenChange={(open) => !open && setBookingToUpdate(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Status do Agendamento</DialogTitle>
            <DialogDescription>
              Selecione o novo status para este agendamento
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Select
              value={newStatus}
              onValueChange={(value) =>
                setNewStatus(value as UpdateBookingStatusBodyStatus)
              }
              disabled={
                bookingToUpdate?.statusValue === "CANCELED" ||
                bookingToUpdate?.statusValue === "COMPLETED"
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o novo status" />
              </SelectTrigger>
              <SelectContent>
                {availableStatusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setBookingToUpdate(null)}
              disabled={updateBookingStatus.isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={
                !newStatus ||
                updateBookingStatus.isPending ||
                bookingToUpdate?.statusValue === "CANCELED" ||
                bookingToUpdate?.statusValue === "COMPLETED"
              }
            >
              {updateBookingStatus.isPending ? "Atualizando..." : "Atualizar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
