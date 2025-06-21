export type GetCouponsType =
  (typeof GetCouponsType)[keyof typeof GetCouponsType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetCouponsType = {
  PERCENTAGE: "PERCENTAGE",
  FIXED: "FIXED",
  FREE: "FREE",
} as const;
