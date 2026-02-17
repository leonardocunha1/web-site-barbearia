export type ListUsersSortDirection =
  (typeof ListUsersSortDirection)[keyof typeof ListUsersSortDirection];

 
export const ListUsersSortDirection = {
  asc: "asc",
  desc: "desc",
} as const;
