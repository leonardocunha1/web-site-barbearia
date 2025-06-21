export type GetUsersMe200UserRole =
  (typeof GetUsersMe200UserRole)[keyof typeof GetUsersMe200UserRole];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetUsersMe200UserRole = {
  CLIENTE: "CLIENTE",
  PROFISSIONAL: "PROFISSIONAL",
  ADMIN: "ADMIN",
} as const;
