export type ListCoupons200CouponsItemType =
  (typeof ListCoupons200CouponsItemType)[keyof typeof ListCoupons200CouponsItemType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListCoupons200CouponsItemType = {
  PERCENTAGE: "PERCENTAGE",
  FIXED: "FIXED",
  FREE: "FREE",
} as const;
