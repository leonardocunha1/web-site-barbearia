export type ListCouponsScope =
  (typeof ListCouponsScope)[keyof typeof ListCouponsScope];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListCouponsScope = {
  GLOBAL: "GLOBAL",
  SERVICE: "SERVICE",
  PROFESSIONAL: "PROFESSIONAL",
} as const;
