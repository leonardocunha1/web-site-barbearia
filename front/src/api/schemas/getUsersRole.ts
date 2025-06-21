export type GetUsersRole = (typeof GetUsersRole)[keyof typeof GetUsersRole];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetUsersRole = {
  ADMIN: "ADMIN",
  CLIENTE: "CLIENTE",
  PROFISSIONAL: "PROFISSIONAL",
} as const;
