import type { GetUserProfile200UserRole } from "./getUserProfile200UserRole";

export type GetUserProfile200User = {
  id: string;
  name: string;
  email: string;
  /** @nullable */
  phone?: string | null;
  role?: GetUserProfile200UserRole;
  emailVerified: boolean;
  active: boolean;
  createdAt: string;
};
