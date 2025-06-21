import type { PostAuthLogin200UserRole } from "./postAuthLogin200UserRole";

export type PostAuthLogin200User = {
  id: string;
  nome: string;
  email?: string;
  /** @nullable */
  telefone?: string | null;
  role?: PostAuthLogin200UserRole;
  emailVerified: boolean;
  active: boolean;
  createdAt: string;
};
