export type ListServicesSortDirection =
  (typeof ListServicesSortDirection)[keyof typeof ListServicesSortDirection];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListServicesSortDirection = {
  asc: "asc",
  desc: "desc",
} as const;
