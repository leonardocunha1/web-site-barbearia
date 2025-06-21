import type { GetUsers200UsersItemRole } from "./getUsers200UsersItemRole";

export type GetUsers200UsersItem = {
  id: string;
  nome: string;
  email?: string;
  /** @nullable */
  telefone?: string | null;
  role?: GetUsers200UsersItemRole;
  emailVerified: boolean;
  active: boolean;
  createdAt: string;
};
