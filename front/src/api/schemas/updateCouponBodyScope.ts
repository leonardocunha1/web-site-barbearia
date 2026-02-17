export type UpdateCouponBodyScope =
  (typeof UpdateCouponBodyScope)[keyof typeof UpdateCouponBodyScope];

 
export const UpdateCouponBodyScope = {
  GLOBAL: "GLOBAL",
  SERVICE: "SERVICE",
  PROFESSIONAL: "PROFESSIONAL",
} as const;
