/**
 * Campo para ordenação de cupons
 */
export type ListCouponsSortItemField =
  (typeof ListCouponsSortItemField)[keyof typeof ListCouponsSortItemField];

 
export const ListCouponsSortItemField = {
  code: "code",
  type: "type",
  scope: "scope",
  createdAt: "createdAt",
  startDate: "startDate",
  endDate: "endDate",
  active: "active",
  uses: "uses",
} as const;
