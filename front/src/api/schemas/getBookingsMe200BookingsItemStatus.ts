export type GetBookingsMe200BookingsItemStatus =
  (typeof GetBookingsMe200BookingsItemStatus)[keyof typeof GetBookingsMe200BookingsItemStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetBookingsMe200BookingsItemStatus = {
  PENDENTE: "PENDENTE",
  CONFIRMADO: "CONFIRMADO",
  CANCELADO: "CANCELADO",
  CONCLUIDO: "CONCLUIDO",
} as const;
