export type UpdateBookingStatusBodyStatus =
  (typeof UpdateBookingStatusBodyStatus)[keyof typeof UpdateBookingStatusBodyStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const UpdateBookingStatusBodyStatus = {
  PENDENTE: "PENDENTE",
  CONFIRMADO: "CONFIRMADO",
  CANCELADO: "CANCELADO",
  CONCLUIDO: "CONCLUIDO",
} as const;
