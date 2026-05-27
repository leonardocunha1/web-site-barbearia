"use client";

import { useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import { OverviewSection } from "../overview";
import { BookingsSection } from "./bookings-section";
import { AnalyticsSection } from "./analytics-section";
import { SettingsSection } from "./settings-section";
import { HolidaysSection } from "./settings/holidays/components/holidays-section";
import { RotateCw } from "lucide-react";
import { useGetProfessionalDashboard } from "@/api/react-query/professionals";

export function ProfessionalDashboard() {
  const { data, refetch, isLoading } = useGetProfessionalDashboard(
    { range: "week" },
    {
      query: {
        refetchInterval: 30000,
      },
    },
  );

  useEffect(() => {}, [isLoading]);

  const handleManualRefresh = async () => {
    await refetch();
  };

  // const getLastUpdateText = () => {
  //   if (!lastUpdated) return "Aguardando atualização...";
  //   const now = new Date();
  //   const diffSeconds = Math.floor(
  //     (now.getTime() - lastUpdated.getTime()) / 1000,
  //   );

  //   if (diffSeconds < 60) {
  //     return `Atualizado há ${diffSeconds}s`;
  //   }
  //   return `Atualizado há ${Math.floor(diffSeconds / 60)}m`;
  // };

  const tabTriggerClass =
    "relative cursor-pointer rounded-none border-0 bg-transparent px-4 py-2.5 font-mono text-[11px] tracking-[0.18em] uppercase text-foreground/60 hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none after:absolute after:inset-x-0 after:-bottom-px after:h-[2px] after:bg-cobre-600 after:scale-x-0 after:origin-left after:transition-transform data-[state=active]:after:scale-x-100";

  return (
    <div className="space-y-8">
      {/* Header editorial */}
      <header className="border-foreground/15 flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="bg-foreground/60 h-px w-8" aria-hidden />
            <span className="text-foreground/70 font-mono text-[10px] tracking-[0.25em] uppercase">
              Painel profissional · auto-refresh 30s
            </span>
          </div>
          <h1 className="font-display text-foreground text-3xl leading-tight font-medium tracking-tight sm:text-4xl">
            Olá,{" "}
            <span className="text-cobre-700 italic">
              {data?.professional?.name || "Profissional"}
            </span>
            .
          </h1>
        </div>
        <Button
          onClick={handleManualRefresh}
          disabled={isLoading}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RotateCw className="h-4 w-4" />
          Atualizar
        </Button>
      </header>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-transparent inline-flex flex-wrap gap-0 border-b border-foreground/10 p-0 h-auto rounded-none w-full justify-start">
          <TabsTrigger value="overview" className={tabTriggerClass}>
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="bookings" className={tabTriggerClass}>
            Agendamentos
          </TabsTrigger>
          <TabsTrigger value="analytics" className={tabTriggerClass}>
            Análises
          </TabsTrigger>
          <TabsTrigger value="holidays" className={tabTriggerClass}>
            Feriados
          </TabsTrigger>
          <TabsTrigger value="settings" className={tabTriggerClass}>
            Configurações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <OverviewSection />
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <BookingsSection />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsSection />
        </TabsContent>

        <TabsContent value="holidays" className="space-y-4">
          <HolidaysSection />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <SettingsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ProfessionalDashboard;
