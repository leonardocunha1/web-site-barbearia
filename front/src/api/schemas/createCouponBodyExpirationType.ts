export type CreateCouponBodyExpirationType =
  (typeof CreateCouponBodyExpirationType)[keyof typeof CreateCouponBodyExpirationType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const CreateCouponBodyExpirationType = {
  DATE: "DATE",
  QUANTITY: "QUANTITY",
  BOTH: "BOTH",
} as const;
