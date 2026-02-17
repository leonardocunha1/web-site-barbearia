export type CreateCouponBodyType =
  (typeof CreateCouponBodyType)[keyof typeof CreateCouponBodyType];

 
export const CreateCouponBodyType = {
  PERCENTAGE: "PERCENTAGE",
  FIXED: "FIXED",
  FREE: "FREE",
} as const;
