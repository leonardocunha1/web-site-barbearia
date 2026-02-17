export type LoginUser200UserRole =
  (typeof LoginUser200UserRole)[keyof typeof LoginUser200UserRole];

 
export const LoginUser200UserRole = {
  CLIENT: "CLIENT",
  PROFESSIONAL: "PROFESSIONAL",
  ADMIN: "ADMIN",
} as const;
