export type GetUserProfile200UserRole =
  (typeof GetUserProfile200UserRole)[keyof typeof GetUserProfile200UserRole];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetUserProfile200UserRole = {
  CLIENTE: "CLIENTE",
  PROFISSIONAL: "PROFISSIONAL",
  ADMIN: "ADMIN",
} as const;
