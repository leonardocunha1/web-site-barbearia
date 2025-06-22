export type ListHolidaysSortOrder =
  (typeof ListHolidaysSortOrder)[keyof typeof ListHolidaysSortOrder];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListHolidaysSortOrder = {
  asc: "asc",
  desc: "desc",
} as const;
