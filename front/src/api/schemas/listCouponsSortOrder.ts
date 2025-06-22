export type ListCouponsSortOrder =
  (typeof ListCouponsSortOrder)[keyof typeof ListCouponsSortOrder];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListCouponsSortOrder = {
  asc: "asc",
  desc: "desc",
} as const;
