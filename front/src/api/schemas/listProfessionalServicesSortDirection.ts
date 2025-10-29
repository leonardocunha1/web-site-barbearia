export type ListProfessionalServicesSortDirection =
  (typeof ListProfessionalServicesSortDirection)[keyof typeof ListProfessionalServicesSortDirection];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListProfessionalServicesSortDirection = {
  asc: "asc",
  desc: "desc",
} as const;
