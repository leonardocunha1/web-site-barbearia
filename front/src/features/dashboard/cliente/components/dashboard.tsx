import { UserCircle2 } from "lucide-react";
import { DashboardLayout } from "../../layout/dashboard-layout";
import { ProfileSection } from "./profile";
import { UnifiedClientSection } from "./unified-section";
import { useUser } from "@/contexts/user";

export default function ClientDashboard() {
  const { user } = useUser();
  const userName = user?.user.name || "Cliente";
  return (
    <DashboardLayout
      title={`Olá, ${userName}`}
      iconGroup={<UserCircle2 className="h-8 w-8 text-gray-600" />}
      tabs={[
        {
          value: "overview",
          label: "Visão Geral",
          content: <UnifiedClientSection />,
        },
        { value: "dados", label: "Meus Dados", content: <ProfileSection /> },
      ]}
    />
  );
}
