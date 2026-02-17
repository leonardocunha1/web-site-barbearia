export type ListProfessionalBookings200BookingsItemStatus =
  (typeof ListProfessionalBookings200BookingsItemStatus)[keyof typeof ListProfessionalBookings200BookingsItemStatus];

 
export const ListProfessionalBookings200BookingsItemStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELED: "CANCELED",
  COMPLETED: "COMPLETED",
} as const;
