export type GetBookingsProfessional200BookingsItemStatus =
  (typeof GetBookingsProfessional200BookingsItemStatus)[keyof typeof GetBookingsProfessional200BookingsItemStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetBookingsProfessional200BookingsItemStatus = {
  PENDENTE: "PENDENTE",
  CONFIRMADO: "CONFIRMADO",
  CANCELADO: "CANCELADO",
  CONCLUIDO: "CONCLUIDO",
} as const;
