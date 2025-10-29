export type ListHolidaysSortDirection =
  (typeof ListHolidaysSortDirection)[keyof typeof ListHolidaysSortDirection];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListHolidaysSortDirection = {
  asc: "asc",
  desc: "desc",
} as const;
