import type { LoginUser200UserRole } from "./loginUser200UserRole";

export type LoginUser200User = {
  id: string;
  name: string;
  email: string;
  /** @nullable */
  phone?: string | null;
  role?: LoginUser200UserRole;
  emailVerified: boolean;
  active: boolean;
  createdAt: string;
};
