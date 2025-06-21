export type PostCouponsBodyType =
  (typeof PostCouponsBodyType)[keyof typeof PostCouponsBodyType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostCouponsBodyType = {
  PERCENTAGE: "PERCENTAGE",
  FIXED: "FIXED",
  FREE: "FREE",
} as const;
