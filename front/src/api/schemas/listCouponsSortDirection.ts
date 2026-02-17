export type ListCouponsSortDirection =
  (typeof ListCouponsSortDirection)[keyof typeof ListCouponsSortDirection];

 
export const ListCouponsSortDirection = {
  asc: "asc",
  desc: "desc",
} as const;
