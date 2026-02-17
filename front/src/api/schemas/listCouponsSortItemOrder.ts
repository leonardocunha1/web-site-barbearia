/**
 * Ordem de ordenação
 */
export type ListCouponsSortItemOrder =
  (typeof ListCouponsSortItemOrder)[keyof typeof ListCouponsSortItemOrder];

 
export const ListCouponsSortItemOrder = {
  asc: "asc",
  desc: "desc",
} as const;
