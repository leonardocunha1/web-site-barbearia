export type ListUserBookingsStatus =
  (typeof ListUserBookingsStatus)[keyof typeof ListUserBookingsStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListUserBookingsStatus = {
  PENDENTE: "PENDENTE",
  CONFIRMADO: "CONFIRMADO",
  CANCELADO: "CANCELADO",
  CONCLUIDO: "CONCLUIDO",
} as const;
