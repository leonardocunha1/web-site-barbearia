import type { ListUsers200UsersItemRole } from "./listUsers200UsersItemRole";

export type ListUsers200UsersItem = {
  id: string;
  nome: string;
  email: string;
  /** @nullable */
  telefone?: string | null;
  role?: ListUsers200UsersItemRole;
  emailVerified: boolean;
  active: boolean;
  createdAt: string;
};
