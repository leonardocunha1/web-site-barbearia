export type ListOrSearchProfessionalsSortDirection =
  (typeof ListOrSearchProfessionalsSortDirection)[keyof typeof ListOrSearchProfessionalsSortDirection];

 
export const ListOrSearchProfessionalsSortDirection = {
  asc: "asc",
  desc: "desc",
} as const;
