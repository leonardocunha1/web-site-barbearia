export type ListUserBookings200BookingsItemStatus =
  (typeof ListUserBookings200BookingsItemStatus)[keyof typeof ListUserBookings200BookingsItemStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListUserBookings200BookingsItemStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELED: "CANCELED",
  COMPLETED: "COMPLETED",
} as const;
