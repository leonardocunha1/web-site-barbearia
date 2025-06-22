export type GetCouponById200CouponType =
  (typeof GetCouponById200CouponType)[keyof typeof GetCouponById200CouponType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetCouponById200CouponType = {
  PERCENTAGE: "PERCENTAGE",
  FIXED: "FIXED",
  FREE: "FREE",
} as const;
