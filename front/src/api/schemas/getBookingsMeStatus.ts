export type GetBookingsMeStatus =
  (typeof GetBookingsMeStatus)[keyof typeof GetBookingsMeStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetBookingsMeStatus = {
  PENDENTE: "PENDENTE",
  CONFIRMADO: "CONFIRMADO",
  CANCELADO: "CANCELADO",
  CONCLUIDO: "CONCLUIDO",
} as const;
