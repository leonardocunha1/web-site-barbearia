export type ListUsersRole = (typeof ListUsersRole)[keyof typeof ListUsersRole];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListUsersRole = {
  ADMIN: "ADMIN",
  CLIENT: "CLIENT",
  PROFESSIONAL: "PROFESSIONAL",
} as const;
