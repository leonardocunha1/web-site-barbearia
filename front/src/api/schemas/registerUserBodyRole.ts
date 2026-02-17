export type RegisterUserBodyRole =
  (typeof RegisterUserBodyRole)[keyof typeof RegisterUserBodyRole];

 
export const RegisterUserBodyRole = {
  CLIENT: "CLIENT",
  PROFESSIONAL: "PROFESSIONAL",
  ADMIN: "ADMIN",
} as const;
