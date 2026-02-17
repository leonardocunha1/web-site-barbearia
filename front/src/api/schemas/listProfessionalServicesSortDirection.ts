export type ListProfessionalServicesSortDirection =
  (typeof ListProfessionalServicesSortDirection)[keyof typeof ListProfessionalServicesSortDirection];

 
export const ListProfessionalServicesSortDirection = {
  asc: "asc",
  desc: "desc",
} as const;
