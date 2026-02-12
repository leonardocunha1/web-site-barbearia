export type ListUsers200UsersItemRole =
  (typeof ListUsers200UsersItemRole)[keyof typeof ListUsers200UsersItemRole];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListUsers200UsersItemRole = {
  CLIENT: "CLIENT",
  PROFESSIONAL: "PROFESSIONAL",
  ADMIN: "ADMIN",
} as const;
