"use client";

import { useState, useEffect } from "react";
import { Briefcase, UserCircle2 } from "lucide-react";
import { OverviewSection } from "./overview";
import { DashboardLayout } from "../layout/dashboard-layout";
import ServicosSection from "./servicos-section/layout";
import { ProfissionalSection } from "./professional-section/page";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // 🔹 Estado da tab controlado pelo React
  const [currentTab, setCurrentTab] = useState<string>(
    searchParams.get("tab") || "overview",
  );

  // 🔹 Sincroniza URL ao montar (para links diretos)
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && tab !== currentTab) {
      setCurrentTab(tab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    if (tab === currentTab) return;

    setCurrentTab(tab);

    // 🔹 Mantém apenas 'tab' na URL, limpa todos os outros parâmetros
    const params = new URLSearchParams();
    params.set("tab", tab);

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

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
        { value: "servicos", label: "Serviços", content: <ServicosSection /> },
      ]}
      currentTab={currentTab}
      onTabChange={handleTabChange}
    />
  );
}

// import { Briefcase, UserCircle2 } from "lucide-react";
// import { OverviewSection } from "./overview";
// import { DashboardLayout } from "../layout/dashboard-layout";
// import ServicosSection from "./servicos-section/layout";
// import { ProfissionalSection } from "./professional-section/page";

// export default function AdminDashboard() {
//   return (
//     <DashboardLayout
//       title="Painel do Administrador"
//       iconGroup={
//         <div className="flex items-center gap-2">
//           <Briefcase className="h-6 w-6 text-gray-600" />
//           <UserCircle2 className="h-8 w-8 text-gray-600" />
//         </div>
//       }
//       tabs={[
//         {
//           value: "overview",
//           label: "Visão Geral",
//           content: <OverviewSection />,
//         },
//         {
//           value: "info-professional",
//           label: "Funcionários",
//           content: <ProfissionalSection />,
//         },
//         {
//           value: "servicos",
//           label: "Serviços",
//           content: <ServicosSection />,
//         },
//       ]}
//     />
//   );
// }
