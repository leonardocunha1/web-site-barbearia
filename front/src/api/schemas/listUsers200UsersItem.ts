import type { ListUsers200UsersItemRole } from "./listUsers200UsersItemRole";

export type ListUsers200UsersItem = {
  id: string;
  name: string;
  email: string;
  /** @nullable */
  phone?: string | null;
  role?: ListUsers200UsersItemRole;
  emailVerified: boolean;
  active: boolean;
  createdAt: string;
};
