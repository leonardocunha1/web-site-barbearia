import { requireRole } from "@/shared/services/require-role";
import ProfessionalDashboardLayoutClient from "./layout.client";

export default async function ProfessionalDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["PROFESSIONAL"]);
  return (
    <ProfessionalDashboardLayoutClient>
      {children}
    </ProfessionalDashboardLayoutClient>
  );
}
