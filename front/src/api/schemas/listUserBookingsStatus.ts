export type ListUserBookingsStatus =
  (typeof ListUserBookingsStatus)[keyof typeof ListUserBookingsStatus];

 
export const ListUserBookingsStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELED: "CANCELED",
  COMPLETED: "COMPLETED",
} as const;
