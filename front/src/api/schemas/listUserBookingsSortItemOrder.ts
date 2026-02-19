/**
 * SortOrder
 */
export type ListUserBookingsSortItemOrder =
  (typeof ListUserBookingsSortItemOrder)[keyof typeof ListUserBookingsSortItemOrder];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListUserBookingsSortItemOrder = {
  asc: "asc",
  desc: "desc",
} as const;
