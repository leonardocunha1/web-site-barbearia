export type RegisterUserBodyRole =
  (typeof RegisterUserBodyRole)[keyof typeof RegisterUserBodyRole];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RegisterUserBodyRole = {
  CLIENTE: "CLIENTE",
  PROFISSIONAL: "PROFISSIONAL",
  ADMIN: "ADMIN",
} as const;
