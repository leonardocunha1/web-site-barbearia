export type RegisterUserBodyRole =
  (typeof RegisterUserBodyRole)[keyof typeof RegisterUserBodyRole];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RegisterUserBodyRole = {
  CLIENT: "CLIENT",
  PROFESSIONAL: "PROFESSIONAL",
  ADMIN: "ADMIN",
} as const;
