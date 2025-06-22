export type UpdateCouponBodyType =
  (typeof UpdateCouponBodyType)[keyof typeof UpdateCouponBodyType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const UpdateCouponBodyType = {
  PERCENTAGE: "PERCENTAGE",
  FIXED: "FIXED",
  FREE: "FREE",
} as const;
