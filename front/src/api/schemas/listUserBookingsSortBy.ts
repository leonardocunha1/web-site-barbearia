export type ListUserBookingsSortBy =
  (typeof ListUserBookingsSortBy)[keyof typeof ListUserBookingsSortBy];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListUserBookingsSortBy = {
  startDateTime: "startDateTime",
  totalAmount: "totalAmount",
} as const;
