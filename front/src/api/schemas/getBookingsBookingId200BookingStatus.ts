export type GetBookingsBookingId200BookingStatus =
  (typeof GetBookingsBookingId200BookingStatus)[keyof typeof GetBookingsBookingId200BookingStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetBookingsBookingId200BookingStatus = {
  PENDENTE: "PENDENTE",
  CONFIRMADO: "CONFIRMADO",
  CANCELADO: "CANCELADO",
  CONCLUIDO: "CONCLUIDO",
} as const;
