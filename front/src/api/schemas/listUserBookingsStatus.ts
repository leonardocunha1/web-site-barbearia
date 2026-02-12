export type ListUserBookingsStatus =
  (typeof ListUserBookingsStatus)[keyof typeof ListUserBookingsStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListUserBookingsStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELED: "CANCELED",
  COMPLETED: "COMPLETED",
} as const;
