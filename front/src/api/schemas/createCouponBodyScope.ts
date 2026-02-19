export type CreateCouponBodyScope =
  (typeof CreateCouponBodyScope)[keyof typeof CreateCouponBodyScope];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const CreateCouponBodyScope = {
  GLOBAL: "GLOBAL",
  SERVICE: "SERVICE",
  PROFESSIONAL: "PROFESSIONAL",
} as const;
