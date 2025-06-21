export type PostCouponsBodyScope =
  (typeof PostCouponsBodyScope)[keyof typeof PostCouponsBodyScope];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostCouponsBodyScope = {
  GLOBAL: "GLOBAL",
  SERVICE: "SERVICE",
  PROFESSIONAL: "PROFESSIONAL",
} as const;
