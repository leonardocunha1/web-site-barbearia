export type ListOrSearchProfessionalsStatus =
  (typeof ListOrSearchProfessionalsStatus)[keyof typeof ListOrSearchProfessionalsStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListOrSearchProfessionalsStatus = {
  active: "active",
  inactive: "inactive",
} as const;
