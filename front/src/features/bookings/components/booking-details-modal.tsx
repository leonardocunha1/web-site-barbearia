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

const labelClass =
  "text-foreground/70 font-mono text-[10px] tracking-widest uppercase";

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
    return (
      <div className="text-foreground/60 font-mono text-xs tracking-widest uppercase">
        Carregando detalhes...
      </div>
    );
  }

  if (isError || !booking || !formatted) {
    return (
      <div className="text-destructive font-mono text-xs tracking-widest uppercase">
        Não foi possível carregar os detalhes do agendamento.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header editorial */}
      <header className="border-foreground/15 flex items-start justify-between border-b pb-3">
        <div className="flex flex-col gap-1">
          <span className={labelClass}>Agendamento</span>
          <span className="font-display text-foreground text-lg font-medium tracking-tight">
            #{booking.id.slice(0, 8).toUpperCase()}
          </span>
        </div>
        <StatusBadge status={formatted.status} />
      </header>

      {/* Detalhes */}
      <dl className="border-foreground/15 divide-foreground/15 divide-y border-y">
        <div className="flex items-center justify-between py-3 text-sm">
          <dt className={labelClass}>Data</dt>
          <dd className="text-foreground font-mono">{formatted.date}</dd>
        </div>
        <div className="flex items-center justify-between py-3 text-sm">
          <dt className={labelClass}>Horário</dt>
          <dd className="text-foreground font-mono font-bold">
            {formatted.time}
          </dd>
        </div>
        <div className="flex items-start justify-between gap-4 py-3 text-sm">
          <dt className={labelClass}>Serviços</dt>
          <dd className="text-foreground text-right">{formatted.services}</dd>
        </div>
      </dl>

      <dl className="border-foreground/15 divide-foreground/15 divide-y border-b">
        <div className="flex items-center justify-between py-3 text-sm">
          <dt className={labelClass}>Cliente</dt>
          <dd className="text-foreground font-medium">
            {booking.user?.name ?? "—"}
          </dd>
        </div>
        <div className="flex items-center justify-between py-3 text-sm">
          <dt className={labelClass}>Profissional</dt>
          <dd className="text-foreground font-medium">
            {booking.professional?.user?.name ?? "—"}
          </dd>
        </div>
        {booking.totalAmount != null && (
          <div className="flex items-center justify-between py-3 text-sm">
            <dt className={labelClass}>Total</dt>
            <dd className="text-cobre-700 font-mono font-bold">
              R$ {booking.totalAmount}
            </dd>
          </div>
        )}
      </dl>

      {booking.notes && (
        <div className="border-cobre-600 border-l-2 px-4 py-3">
          <p className={labelClass}>Observações</p>
          <p className="text-foreground mt-1 text-sm leading-relaxed">
            {booking.notes}
          </p>
        </div>
      )}
    </div>
  );
}
