export type UpdateBookingStatusBodyStatus =
  (typeof UpdateBookingStatusBodyStatus)[keyof typeof UpdateBookingStatusBodyStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const UpdateBookingStatusBodyStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELED: "CANCELED",
  COMPLETED: "COMPLETED",
} as const;
