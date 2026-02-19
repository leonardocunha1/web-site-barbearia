import { requireRole } from "@/shared/services/require-role";
import ClientDashboardPageClient from "./page.client";

export default async function Page() {
  await requireRole(["CLIENT"]);
  return <ClientDashboardPageClient />;
}
