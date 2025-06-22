/**
 * SortField
 */
export type ListUserBookingsSortItemField =
  (typeof ListUserBookingsSortItemField)[keyof typeof ListUserBookingsSortItemField];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListUserBookingsSortItemField = {
  dataHoraInicio: "dataHoraInicio",
  profissional: "profissional",
  status: "status",
  valorFinal: "valorFinal",
} as const;
