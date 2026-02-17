/**
 * SortOrder
 */
export type ListProfessionalBookingsSortItemOrder =
  (typeof ListProfessionalBookingsSortItemOrder)[keyof typeof ListProfessionalBookingsSortItemOrder];

 
export const ListProfessionalBookingsSortItemOrder = {
  asc: "asc",
  desc: "desc",
} as const;
