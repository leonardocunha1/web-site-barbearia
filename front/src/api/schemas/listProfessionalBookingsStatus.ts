export type ListProfessionalBookingsStatus =
  (typeof ListProfessionalBookingsStatus)[keyof typeof ListProfessionalBookingsStatus];

 
export const ListProfessionalBookingsStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELED: "CANCELED",
  COMPLETED: "COMPLETED",
} as const;
