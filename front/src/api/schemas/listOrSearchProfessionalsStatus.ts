export type ListOrSearchProfessionalsStatus =
  (typeof ListOrSearchProfessionalsStatus)[keyof typeof ListOrSearchProfessionalsStatus];

 
export const ListOrSearchProfessionalsStatus = {
  active: "active",
  inactive: "inactive",
} as const;
