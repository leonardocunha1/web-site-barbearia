export type ListUsersSortOrder =
  (typeof ListUsersSortOrder)[keyof typeof ListUsersSortOrder];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListUsersSortOrder = {
  asc: "asc",
  desc: "desc",
} as const;
