export type GetBookingById200BookingStatus =
  (typeof GetBookingById200BookingStatus)[keyof typeof GetBookingById200BookingStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetBookingById200BookingStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELED: "CANCELED",
  COMPLETED: "COMPLETED",
} as const;
