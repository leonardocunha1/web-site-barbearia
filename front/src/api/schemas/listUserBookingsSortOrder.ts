export type ListUserBookingsSortOrder =
  (typeof ListUserBookingsSortOrder)[keyof typeof ListUserBookingsSortOrder];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListUserBookingsSortOrder = {
  asc: "asc",
  desc: "desc",
} as const;
