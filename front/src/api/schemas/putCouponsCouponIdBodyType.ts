export type PutCouponsCouponIdBodyType =
  (typeof PutCouponsCouponIdBodyType)[keyof typeof PutCouponsCouponIdBodyType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutCouponsCouponIdBodyType = {
  PERCENTAGE: "PERCENTAGE",
  FIXED: "FIXED",
  FREE: "FREE",
} as const;
