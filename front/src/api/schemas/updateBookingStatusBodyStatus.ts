export type UpdateBookingStatusBodyStatus =
  (typeof UpdateBookingStatusBodyStatus)[keyof typeof UpdateBookingStatusBodyStatus];

 
export const UpdateBookingStatusBodyStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELED: "CANCELED",
  COMPLETED: "COMPLETED",
} as const;
