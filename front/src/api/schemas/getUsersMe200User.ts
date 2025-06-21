import type { GetUsersMe200UserRole } from "./getUsersMe200UserRole";

export type GetUsersMe200User = {
  id: string;
  nome: string;
  email?: string;
  /** @nullable */
  telefone?: string | null;
  role?: GetUsersMe200UserRole;
  emailVerified: boolean;
  active: boolean;
  createdAt: string;
};
