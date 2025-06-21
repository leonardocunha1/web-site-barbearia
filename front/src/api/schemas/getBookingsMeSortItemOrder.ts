export type GetBookingsMeSortItemOrder =
  (typeof GetBookingsMeSortItemOrder)[keyof typeof GetBookingsMeSortItemOrder];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetBookingsMeSortItemOrder = {
  asc: "asc",
  desc: "desc",
} as const;
