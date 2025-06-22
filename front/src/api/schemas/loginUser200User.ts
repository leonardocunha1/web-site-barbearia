import type { LoginUser200UserRole } from "./loginUser200UserRole";

export type LoginUser200User = {
  id: string;
  nome: string;
  email?: string;
  /** @nullable */
  telefone?: string | null;
  role?: LoginUser200UserRole;
  emailVerified: boolean;
  active: boolean;
  createdAt: string;
};
