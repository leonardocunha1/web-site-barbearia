export type ListOrSearchProfessionalsSortDirection =
  (typeof ListOrSearchProfessionalsSortDirection)[keyof typeof ListOrSearchProfessionalsSortDirection];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListOrSearchProfessionalsSortDirection = {
  asc: "asc",
  desc: "desc",
} as const;
