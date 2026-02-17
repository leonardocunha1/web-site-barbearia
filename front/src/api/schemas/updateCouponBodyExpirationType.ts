export type UpdateCouponBodyExpirationType =
  (typeof UpdateCouponBodyExpirationType)[keyof typeof UpdateCouponBodyExpirationType];

 
export const UpdateCouponBodyExpirationType = {
  DATE: "DATE",
  QUANTITY: "QUANTITY",
  BOTH: "BOTH",
} as const;
