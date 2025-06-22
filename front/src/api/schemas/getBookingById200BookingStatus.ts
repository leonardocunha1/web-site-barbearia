export type GetBookingById200BookingStatus =
  (typeof GetBookingById200BookingStatus)[keyof typeof GetBookingById200BookingStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetBookingById200BookingStatus = {
  PENDENTE: "PENDENTE",
  CONFIRMADO: "CONFIRMADO",
  CANCELADO: "CANCELADO",
  CONCLUIDO: "CONCLUIDO",
} as const;
