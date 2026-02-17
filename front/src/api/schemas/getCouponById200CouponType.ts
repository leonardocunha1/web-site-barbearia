export type GetCouponById200CouponType =
  (typeof GetCouponById200CouponType)[keyof typeof GetCouponById200CouponType];

 
export const GetCouponById200CouponType = {
  PERCENTAGE: "PERCENTAGE",
  FIXED: "FIXED",
  FREE: "FREE",
} as const;
