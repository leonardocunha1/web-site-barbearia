export type ListOrSearchProfessionalsSortOrder =
  (typeof ListOrSearchProfessionalsSortOrder)[keyof typeof ListOrSearchProfessionalsSortOrder];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListOrSearchProfessionalsSortOrder = {
  asc: "asc",
  desc: "desc",
} as const;
