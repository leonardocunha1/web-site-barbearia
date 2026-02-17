export type UpdateCouponBodyType =
  (typeof UpdateCouponBodyType)[keyof typeof UpdateCouponBodyType];

 
export const UpdateCouponBodyType = {
  PERCENTAGE: "PERCENTAGE",
  FIXED: "FIXED",
  FREE: "FREE",
} as const;
