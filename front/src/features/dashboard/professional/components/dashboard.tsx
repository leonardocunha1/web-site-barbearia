"use client";

import { useState, useEffect } from "react";
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
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    setLastUpdated(new Date());
  }, [isLoading]);

  const handleManualRefresh = async () => {
    await refetch();
    setLastUpdated(new Date());
  };

  const getLastUpdateText = () => {
    if (!lastUpdated) return "Aguardando atualização...";
    const now = new Date();
    const diffSeconds = Math.floor(
      (now.getTime() - lastUpdated.getTime()) / 1000,
    );

    if (diffSeconds < 60) {
      return `Atualizado há ${diffSeconds}s`;
    }
    return `Atualizado há ${Math.floor(diffSeconds / 60)}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header com refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Olá, {data?.professional?.name || "Profissional"}
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            {getLastUpdateText()} • Atualização automática a cada 30s
          </p>
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
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 gap-0">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="bookings">Agendamentos</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
          <TabsTrigger value="holidays">Feriados</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
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
