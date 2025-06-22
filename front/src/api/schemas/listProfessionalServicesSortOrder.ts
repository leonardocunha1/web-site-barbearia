export type ListProfessionalServicesSortOrder =
  (typeof ListProfessionalServicesSortOrder)[keyof typeof ListProfessionalServicesSortOrder];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListProfessionalServicesSortOrder = {
  asc: "asc",
  desc: "desc",
} as const;
