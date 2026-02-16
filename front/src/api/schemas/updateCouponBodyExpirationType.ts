export type UpdateCouponBodyExpirationType =
  (typeof UpdateCouponBodyExpirationType)[keyof typeof UpdateCouponBodyExpirationType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const UpdateCouponBodyExpirationType = {
  DATE: "DATE",
  QUANTITY: "QUANTITY",
  BOTH: "BOTH",
} as const;
