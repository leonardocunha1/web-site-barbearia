export type LoginUser200UserRole =
  (typeof LoginUser200UserRole)[keyof typeof LoginUser200UserRole];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const LoginUser200UserRole = {
  CLIENT: "CLIENT",
  PROFESSIONAL: "PROFESSIONAL",
  ADMIN: "ADMIN",
} as const;
