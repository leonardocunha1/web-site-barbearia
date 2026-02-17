/**
 * SortOrder
 */
export type ListUserBookingsSortItemOrder =
  (typeof ListUserBookingsSortItemOrder)[keyof typeof ListUserBookingsSortItemOrder];

 
export const ListUserBookingsSortItemOrder = {
  asc: "asc",
  desc: "desc",
} as const;
