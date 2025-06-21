export type GetCouponsSortItemOrder =
  (typeof GetCouponsSortItemOrder)[keyof typeof GetCouponsSortItemOrder];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetCouponsSortItemOrder = {
  asc: "asc",
  desc: "desc",
} as const;
