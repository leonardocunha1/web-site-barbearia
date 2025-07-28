import { UserCircle2 } from "lucide-react";
import { OverviewSection } from "./overview";
import { ReservationsSection } from "./reservation";
import { ProfileSection } from "./profile";
import { RewardsSection } from "./rewards";
import { DashboardLayout } from "../layout/dashboard-layout";

export default function ClientDashboard() {
  return (
    <DashboardLayout
      title="Minha Conta"
      iconGroup={<UserCircle2 className="h-8 w-8 text-gray-600" />}
      tabs={[
        {
          value: "overview",
          label: "Visão Geral",
          content: <OverviewSection />,
        },
        {
          value: "reservas",
          label: "Minhas Reservas",
          content: <ReservationsSection />,
        },
        { value: "dados", label: "Meus Dados", content: <ProfileSection /> },
        { value: "pontuacao", label: "Pontuação", content: <RewardsSection /> },
      ]}
    />
  );
}
