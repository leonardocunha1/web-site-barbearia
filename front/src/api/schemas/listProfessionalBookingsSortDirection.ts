export type ListProfessionalBookingsSortDirection =
  (typeof ListProfessionalBookingsSortDirection)[keyof typeof ListProfessionalBookingsSortDirection];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListProfessionalBookingsSortDirection = {
  asc: "asc",
  desc: "desc",
} as const;
