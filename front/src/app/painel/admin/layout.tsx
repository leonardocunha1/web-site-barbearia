import { requireRole } from "@/shared/services/require-role";
import AdminDashboardLayoutClient from "./layout.client";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["ADMIN"]);
  return <AdminDashboardLayoutClient>{children}</AdminDashboardLayoutClient>;
}
