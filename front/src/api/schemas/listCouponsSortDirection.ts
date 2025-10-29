export type ListCouponsSortDirection =
  (typeof ListCouponsSortDirection)[keyof typeof ListCouponsSortDirection];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListCouponsSortDirection = {
  asc: "asc",
  desc: "desc",
} as const;
