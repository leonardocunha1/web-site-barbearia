export type ListUsersRole = (typeof ListUsersRole)[keyof typeof ListUsersRole];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListUsersRole = {
  ADMIN: "ADMIN",
  CLIENTE: "CLIENTE",
  PROFISSIONAL: "PROFISSIONAL",
} as const;
