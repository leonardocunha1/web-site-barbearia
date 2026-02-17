export type ListCouponsScope =
  (typeof ListCouponsScope)[keyof typeof ListCouponsScope];

 
export const ListCouponsScope = {
  GLOBAL: "GLOBAL",
  SERVICE: "SERVICE",
  PROFESSIONAL: "PROFESSIONAL",
} as const;
