export type GetBookingsProfessionalStatus =
  (typeof GetBookingsProfessionalStatus)[keyof typeof GetBookingsProfessionalStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetBookingsProfessionalStatus = {
  PENDENTE: "PENDENTE",
  CONFIRMADO: "CONFIRMADO",
  CANCELADO: "CANCELADO",
  CONCLUIDO: "CONCLUIDO",
} as const;
