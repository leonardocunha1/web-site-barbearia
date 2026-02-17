export type ListProfessionalBookingsSortDirection =
  (typeof ListProfessionalBookingsSortDirection)[keyof typeof ListProfessionalBookingsSortDirection];

 
export const ListProfessionalBookingsSortDirection = {
  asc: "asc",
  desc: "desc",
} as const;
