export type ListServicesSortDirection =
  (typeof ListServicesSortDirection)[keyof typeof ListServicesSortDirection];

 
export const ListServicesSortDirection = {
  asc: "asc",
  desc: "desc",
} as const;
