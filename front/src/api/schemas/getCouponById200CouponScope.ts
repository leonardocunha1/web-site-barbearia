export type GetCouponById200CouponScope =
  (typeof GetCouponById200CouponScope)[keyof typeof GetCouponById200CouponScope];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetCouponById200CouponScope = {
  GLOBAL: "GLOBAL",
  SERVICE: "SERVICE",
  PROFESSIONAL: "PROFESSIONAL",
} as const;
