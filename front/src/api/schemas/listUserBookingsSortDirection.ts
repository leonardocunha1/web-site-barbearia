export type ListUserBookingsSortDirection =
  (typeof ListUserBookingsSortDirection)[keyof typeof ListUserBookingsSortDirection];

 
export const ListUserBookingsSortDirection = {
  asc: "asc",
  desc: "desc",
} as const;
