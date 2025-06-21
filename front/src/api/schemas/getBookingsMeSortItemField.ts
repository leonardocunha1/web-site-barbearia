export type GetBookingsMeSortItemField =
  (typeof GetBookingsMeSortItemField)[keyof typeof GetBookingsMeSortItemField];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetBookingsMeSortItemField = {
  dataHoraInicio: "dataHoraInicio",
  profissional: "profissional",
  status: "status",
  valorFinal: "valorFinal",
} as const;
