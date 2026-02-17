export type CreateCouponBodyExpirationType =
  (typeof CreateCouponBodyExpirationType)[keyof typeof CreateCouponBodyExpirationType];

 
export const CreateCouponBodyExpirationType = {
  DATE: "DATE",
  QUANTITY: "QUANTITY",
  BOTH: "BOTH",
} as const;
