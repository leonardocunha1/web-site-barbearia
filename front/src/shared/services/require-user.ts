import { redirect } from "next/navigation";
import userGet from "@/app/api/actions/user";
import type { GetUserProfile200 } from "@/api";

type Role = "ADMIN" | "PROFESSIONAL" | "CLIENT";

export async function requireUser(allowedRoles?: Role[]) {
  const { ok, data } = await userGet();

  if (!ok || !data) {
    redirect("/login");
  }

  const userData = data as GetUserProfile200;

  if (allowedRoles && !allowedRoles.includes(userData.user.role as Role)) {
    redirect("/");
  }

  return userData;
}
