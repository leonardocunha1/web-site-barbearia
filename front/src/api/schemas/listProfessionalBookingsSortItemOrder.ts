/**
 * SortOrder
 */
export type ListProfessionalBookingsSortItemOrder =
  (typeof ListProfessionalBookingsSortItemOrder)[keyof typeof ListProfessionalBookingsSortItemOrder];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListProfessionalBookingsSortItemOrder = {
  asc: "asc",
  desc: "desc",
} as const;
