export type ListUserBookingsSortDirection =
  (typeof ListUserBookingsSortDirection)[keyof typeof ListUserBookingsSortDirection];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListUserBookingsSortDirection = {
  asc: "asc",
  desc: "desc",
} as const;
