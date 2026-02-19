import "server-only";

import { redirect } from "next/navigation";
import userGet from "@/app/api/actions/user";

export type Role = "ADMIN" | "PROFESSIONAL" | "CLIENT";

type RequireRoleOptions = {
  loginPath?: string;
  forbiddenPath?: string;
};

export async function requireRole(
  allowedRoles: Role[],
  options: RequireRoleOptions = {},
) {
  const { loginPath = "/login", forbiddenPath = "/unauthorized" } = options;
  const result = await userGet();

  if (!result.ok || !result.data) {
    redirect(loginPath);
  }

  const role = result.data.user.role as Role | undefined;
  if (!role || !allowedRoles.includes(role)) {
    redirect(forbiddenPath);
  }

  return result.data;
}
