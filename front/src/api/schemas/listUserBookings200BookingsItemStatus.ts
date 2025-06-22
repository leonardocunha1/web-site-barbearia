export type ListUserBookings200BookingsItemStatus =
  (typeof ListUserBookings200BookingsItemStatus)[keyof typeof ListUserBookings200BookingsItemStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListUserBookings200BookingsItemStatus = {
  PENDENTE: "PENDENTE",
  CONFIRMADO: "CONFIRMADO",
  CANCELADO: "CANCELADO",
  CONCLUIDO: "CONCLUIDO",
} as const;
