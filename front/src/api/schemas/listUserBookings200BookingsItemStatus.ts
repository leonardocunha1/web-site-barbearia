export type ListUserBookings200BookingsItemStatus =
  (typeof ListUserBookings200BookingsItemStatus)[keyof typeof ListUserBookings200BookingsItemStatus];

 
export const ListUserBookings200BookingsItemStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELED: "CANCELED",
  COMPLETED: "COMPLETED",
} as const;
