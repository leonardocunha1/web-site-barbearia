export type PatchBookingsBookingIdStatusBodyStatus =
  (typeof PatchBookingsBookingIdStatusBodyStatus)[keyof typeof PatchBookingsBookingIdStatusBodyStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PatchBookingsBookingIdStatusBodyStatus = {
  PENDENTE: "PENDENTE",
  CONFIRMADO: "CONFIRMADO",
  CANCELADO: "CANCELADO",
  CONCLUIDO: "CONCLUIDO",
} as const;
