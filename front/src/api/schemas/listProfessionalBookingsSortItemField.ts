/**
 * SortField
 */
export type ListProfessionalBookingsSortItemField =
  (typeof ListProfessionalBookingsSortItemField)[keyof typeof ListProfessionalBookingsSortItemField];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListProfessionalBookingsSortItemField = {
  dataHoraInicio: "dataHoraInicio",
  profissional: "profissional",
  status: "status",
  valorFinal: "valorFinal",
} as const;
