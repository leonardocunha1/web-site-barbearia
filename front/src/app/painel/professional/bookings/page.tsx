"use client";

import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
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
import { toast } from "sonner";
import { motion } from "framer-motion";
import { PageHeader } from "@/shared/components/ui/page-header";
import { Calendar, Clock, DollarSign, User } from "lucide-react";
import { DatePicker } from "@/shared/components/ui/date-picker";

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

export default function BookingsPage() {
  const { params } = useTableParams();
  const queryClient = useQueryClient();
  const [bookingToUpdate, setBookingToUpdate] = useState<BookingRow | null>(null);
  const [newStatus, setNewStatus] = useState<UpdateBookingStatusBodyStatus | "">("");
  const updateBookingStatus = useUpdateBookingStatus();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Formatar datas para o formato ISO datetime que a API espera
  const formatDateToISO = (dateString: string) => {
    if (!dateString) return undefined;
    const date = new Date(dateString);
    return date.toISOString();
  };

  const parsedStatus = useMemo(() => {
    if (activeTab === "all") return undefined;
    return activeTab.toUpperCase() as ListProfessionalBookingsStatus;
  }, [activeTab]);

  const { data, isLoading } = useListProfessionalBookings(
    {
      page: params.page,
      limit: params.limit,
      status: parsedStatus,
      startDate: formatDateToISO(startDate),
      endDate: formatDateToISO(endDate),
    },
    {}
  );

  const bookings = useMemo<BookingRow[]>(() => {
    return (
      data?.bookings?.map((booking: ListProfessionalBookings200BookingsItem) => {
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
      }) ?? []
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
      { value: "COMPLETED", label: "Concluído" },
      { value: "CANCELED", label: "Cancelado" },
    ],
    CANCELED: [],
    COMPLETED: [],
  };

  const availableStatusOptions = bookingToUpdate
    ? statusOptionsByCurrent[bookingToUpdate.statusValue].filter((option) =>
        option.value === "COMPLETED" ? canComplete(bookingToUpdate) : true
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
          startDate: formatDateToISO(startDate),
          endDate: formatDateToISO(endDate),
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

  const stats = useMemo(() => {
    const all = bookings.length;
    const pending = bookings.filter((b) => b.statusValue === "PENDING").length;
    const confirmed = bookings.filter((b) => b.statusValue === "CONFIRMED").length;
    const completed = bookings.filter((b) => b.statusValue === "COMPLETED").length;
    const total = bookings.reduce((sum, b) => sum + b.totalAmount, 0);

    return { all, pending, confirmed, completed, total };
  }, [bookings]);

  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="h-full space-y-6 p-6">
      {/* Header */}
      <PageHeader
        title="Agendamentos"
        description="Gerencie todos os seus agendamentos"
      />

      {/* Date Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filtrar por Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-stone-700">
                Data Inicial
              </label>
              <DatePicker
                value={startDate}
                max={endDate || undefined}
                onChange={setStartDate}
                placeholder="Selecione a data inicial"
              />
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-stone-700">
                Data Final
              </label>
              <DatePicker
                value={endDate}
                min={startDate || undefined}
                onChange={setEndDate}
                placeholder="Selecione a data final"
              />
            </div>
            {(startDate || endDate) && (
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="gap-2"
              >
                Limpar Filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-4 md:grid-cols-4"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Todos</CardTitle>
            <Calendar className="h-4 w-4 text-stone-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.all}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmados</CardTitle>
            <User className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.confirmed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {stats.total.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bookings Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Lista de Agendamentos</CardTitle>
            <CardDescription>
              Visualize e gerencie todos os seus agendamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="pending">Pendentes</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmados</TabsTrigger>
                <TabsTrigger value="completed">Concluídos</TabsTrigger>
                <TabsTrigger value="canceled">Cancelados</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-0">
                <GenericTable
                  columns={columns}
                  data={bookings}
                  isLoading={isLoading}
                  onRowClick={(row) => {
                    if (
                      row.statusValue !== "COMPLETED" &&
                      row.statusValue !== "CANCELED"
                    ) {
                      setBookingToUpdate(row);
                    }
                  }}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Status Update Dialog */}
      <Dialog
        open={!!bookingToUpdate}
        onOpenChange={(open) => {
          if (!open) {
            setBookingToUpdate(null);
            setNewStatus("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atualizar Status</DialogTitle>
            <DialogDescription>
              Altere o status do agendamento de {bookingToUpdate?.client}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm text-stone-600">
                <strong>Cliente:</strong> {bookingToUpdate?.client}
              </p>
              <p className="text-sm text-stone-600">
                <strong>Serviço:</strong> {bookingToUpdate?.service}
              </p>
              <p className="text-sm text-stone-600">
                <strong>Data/Hora:</strong> {bookingToUpdate?.date} às{" "}
                {bookingToUpdate?.time}
              </p>
              <p className="text-sm text-stone-600">
                <strong>Status Atual:</strong> {bookingToUpdate?.status}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Novo Status</label>
              <Select
                value={newStatus}
                onValueChange={(value) =>
                  setNewStatus(value as UpdateBookingStatusBodyStatus)
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
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setBookingToUpdate(null);
                setNewStatus("");
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={!newStatus || updateBookingStatus.isPending}
            >
              {updateBookingStatus.isPending ? "Atualizando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
