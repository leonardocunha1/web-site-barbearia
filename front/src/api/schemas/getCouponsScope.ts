export type GetCouponsScope =
  (typeof GetCouponsScope)[keyof typeof GetCouponsScope];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetCouponsScope = {
  GLOBAL: "GLOBAL",
  SERVICE: "SERVICE",
  PROFESSIONAL: "PROFESSIONAL",
} as const;
