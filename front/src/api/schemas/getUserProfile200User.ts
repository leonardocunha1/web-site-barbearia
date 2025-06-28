import type { GetUserProfile200UserRole } from "./getUserProfile200UserRole";

export type GetUserProfile200User = {
  id: string;
  nome: string;
  email: string;
  /** @nullable */
  telefone?: string | null;
  role?: GetUserProfile200UserRole;
  emailVerified: boolean;
  active: boolean;
  createdAt: string;
};
