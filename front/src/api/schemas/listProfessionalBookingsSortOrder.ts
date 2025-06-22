export type ListProfessionalBookingsSortOrder =
  (typeof ListProfessionalBookingsSortOrder)[keyof typeof ListProfessionalBookingsSortOrder];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListProfessionalBookingsSortOrder = {
  asc: "asc",
  desc: "desc",
} as const;
