"use client";

import { useState, useEffect } from "react";
import { Briefcase, UserCircle2 } from "lucide-react";
import { OverviewSection } from "./overview";
import { DashboardLayout } from "../layout/dashboard-layout";
import ServicosSection from "../servicos-section/layout";
import { ProfissionalSection } from "../professional-section/page";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [currentTab, setCurrentTab] = useState<string>(
    searchParams.get("tab") || "overview",
  );

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && tab !== currentTab) {
      setCurrentTab(tab);
    }
  }, [searchParams, currentTab]);

  const handleTabChange = (tab: string) => {
    if (tab === currentTab) return;

    setCurrentTab(tab);

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
