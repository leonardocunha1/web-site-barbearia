export type CreateCouponBodyScope =
  (typeof CreateCouponBodyScope)[keyof typeof CreateCouponBodyScope];

 
export const CreateCouponBodyScope = {
  GLOBAL: "GLOBAL",
  SERVICE: "SERVICE",
  PROFESSIONAL: "PROFESSIONAL",
} as const;
