export type GetCouponsSortItemField =
  (typeof GetCouponsSortItemField)[keyof typeof GetCouponsSortItemField];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetCouponsSortItemField = {
  code: "code",
  type: "type",
  scope: "scope",
  createdAt: "createdAt",
  startDate: "startDate",
  endDate: "endDate",
  active: "active",
  uses: "uses",
} as const;
