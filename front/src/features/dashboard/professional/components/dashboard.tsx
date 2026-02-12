import { Briefcase, UserCircle2 } from "lucide-react";
import { OverviewSection } from "./overview";
import { ServicesSection } from "./services";
import { ScheduleSection } from "./schedule";
import { ProfileSection } from "./profile";
import { DashboardLayout } from "../layout/dashboard-layout";

export default function ProfessionalDashboard() {
  return (
    <DashboardLayout
      title="Painel Profissional"
      iconGroup={
        <div className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-gray-600" />
          <UserCircle2 className="h-8 w-8 text-gray-600" />
        </div>
      }
      tabs={[
        {
          value: "overview",
          label: "Visão Geral",
          content: <OverviewSection />,
        },
        {
          value: "servicos",
          label: "Meus Serviços",
          content: <ServicesSection />,
        },
        {
          value: "agenda",
          label: "Minha Agenda",
          content: <ScheduleSection />,
        },
        { value: "dados", label: "Meus Dados", content: <ProfileSection /> },
      ]}
    />
  );
}
