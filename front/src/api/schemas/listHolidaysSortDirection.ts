export type ListHolidaysSortDirection =
  (typeof ListHolidaysSortDirection)[keyof typeof ListHolidaysSortDirection];

 
export const ListHolidaysSortDirection = {
  asc: "asc",
  desc: "desc",
} as const;
