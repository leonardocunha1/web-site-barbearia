export type LoginUser200UserRole =
  (typeof LoginUser200UserRole)[keyof typeof LoginUser200UserRole];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const LoginUser200UserRole = {
  CLIENTE: "CLIENTE",
  PROFISSIONAL: "PROFISSIONAL",
  ADMIN: "ADMIN",
} as const;
