"use client";

import { useMemo } from "react";
import { useGetBookingById } from "@/api";
import { StatusBadge } from "@/shared/components/table/status-badge";
import {
  formatBookingDateTime,
  formatBookingServices,
  formatBookingStatus,
} from "../utils/booking-formatters";

type BookingDetailsModalProps = {
  bookingId: string;
};

export function BookingDetailsModal({ bookingId }: BookingDetailsModalProps) {
  const { data, isLoading, isError } = useGetBookingById(bookingId);

  const booking = data?.booking;

  const formatted = useMemo(() => {
    if (!booking) return null;

    const dateTime = formatBookingDateTime(booking.startDateTime);

    return {
      date: dateTime.date,
      time: dateTime.time,
      services: formatBookingServices(booking.items),
      status: formatBookingStatus(booking.status),
    };
  }, [booking]);

  if (isLoading) {
    return <div className="text-muted-foreground">Carregando detalhes...</div>;
  }

  if (isError || !booking || !formatted) {
    return (
      <div className="text-destructive">
        Nao foi possivel carregar os detalhes do agendamento.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Agendamento</p>
          <p className="text-muted-foreground text-xs">#{booking.id}</p>
        </div>
        <StatusBadge status={formatted.status} />
      </div>

      <div className="grid gap-3 rounded-lg border p-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Data</span>
          <span>{formatted.date}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Horario</span>
          <span>{formatted.time}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Servicos</span>
          <span className="text-right">{formatted.services}</span>
        </div>
      </div>

      <div className="grid gap-3 rounded-lg border p-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Cliente</span>
          <span>{booking.user?.name ?? "-"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Profissional</span>
          <span>{booking.professional?.user?.name ?? "-"}</span>
        </div>
        {booking.totalAmount != null && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total</span>
            <span>R$ {booking.totalAmount}</span>
          </div>
        )}
      </div>

      {booking.notes && (
        <div className="rounded-lg border p-4 text-sm">
          <p className="text-muted-foreground mb-2">Observacoes</p>
          <p>{booking.notes}</p>
        </div>
      )}
    </div>
  );
}
