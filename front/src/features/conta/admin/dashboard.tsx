import { Briefcase, UserCircle2 } from "lucide-react";
import { OverviewSection } from "./overview";
import { DashboardLayout } from "../layout/dashboard-layout";
import ServicosSection from "./servicos-section/layout";
import { ProfissionalSection } from "./professional-section/layout";

export default function AdminDashboard() {
  return (
    <DashboardLayout
      title="Painel do Administrador"
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
          value: "info-professional",
          label: "Funcionários",
          content: <ProfissionalSection />,
        },
        {
          value: "servicos",
          label: "Serviços",
          content: <ServicosSection />,
        }
      ]}
    />
  );
}
