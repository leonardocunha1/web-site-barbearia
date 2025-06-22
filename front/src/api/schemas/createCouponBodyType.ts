export type CreateCouponBodyType =
  (typeof CreateCouponBodyType)[keyof typeof CreateCouponBodyType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const CreateCouponBodyType = {
  PERCENTAGE: "PERCENTAGE",
  FIXED: "FIXED",
  FREE: "FREE",
} as const;
