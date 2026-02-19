export type CreateCoupon201CouponType =
  (typeof CreateCoupon201CouponType)[keyof typeof CreateCoupon201CouponType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const CreateCoupon201CouponType = {
  PERCENTAGE: "PERCENTAGE",
  FIXED: "FIXED",
  FREE: "FREE",
} as const;
