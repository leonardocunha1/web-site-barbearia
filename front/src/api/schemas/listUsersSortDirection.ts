export type ListUsersSortDirection =
  (typeof ListUsersSortDirection)[keyof typeof ListUsersSortDirection];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListUsersSortDirection = {
  asc: "asc",
  desc: "desc",
} as const;
