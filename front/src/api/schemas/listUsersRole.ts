export type ListUsersRole = (typeof ListUsersRole)[keyof typeof ListUsersRole];

 
export const ListUsersRole = {
  ADMIN: "ADMIN",
  CLIENT: "CLIENT",
  PROFESSIONAL: "PROFESSIONAL",
} as const;
