/**
 * Campo para ordenação de cupons
 */
export type ListCouponsSortItemField =
  (typeof ListCouponsSortItemField)[keyof typeof ListCouponsSortItemField];

// eslint-disable-next-line @typescript-eslint/no-redeclare
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
