export type ListCouponsType =
  (typeof ListCouponsType)[keyof typeof ListCouponsType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListCouponsType = {
  PERCENTAGE: "PERCENTAGE",
  FIXED: "FIXED",
  FREE: "FREE",
} as const;
