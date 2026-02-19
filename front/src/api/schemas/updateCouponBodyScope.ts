export type UpdateCouponBodyScope =
  (typeof UpdateCouponBodyScope)[keyof typeof UpdateCouponBodyScope];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const UpdateCouponBodyScope = {
  GLOBAL: "GLOBAL",
  SERVICE: "SERVICE",
  PROFESSIONAL: "PROFESSIONAL",
} as const;
