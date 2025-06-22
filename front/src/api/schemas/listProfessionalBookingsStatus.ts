export type ListProfessionalBookingsStatus =
  (typeof ListProfessionalBookingsStatus)[keyof typeof ListProfessionalBookingsStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListProfessionalBookingsStatus = {
  PENDENTE: "PENDENTE",
  CONFIRMADO: "CONFIRMADO",
  CANCELADO: "CANCELADO",
  CONCLUIDO: "CONCLUIDO",
} as const;
