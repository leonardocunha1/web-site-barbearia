/**
 * CouponSortOrder
 */
export type ListCouponsSortItemOrder =
  (typeof ListCouponsSortItemOrder)[keyof typeof ListCouponsSortItemOrder];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListCouponsSortItemOrder = {
  asc: "asc",
  desc: "desc",
} as const;
