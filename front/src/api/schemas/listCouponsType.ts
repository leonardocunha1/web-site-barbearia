export type ListCouponsType =
  (typeof ListCouponsType)[keyof typeof ListCouponsType];

 
export const ListCouponsType = {
  PERCENTAGE: "PERCENTAGE",
  FIXED: "FIXED",
  FREE: "FREE",
} as const;
