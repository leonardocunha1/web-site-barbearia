import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { UserCircle2 } from "lucide-react";
import { OverviewSection } from "./overview";
import { ReservationsSection } from "./reservation";
import { ProfileSection } from "./profile";
import { RewardsSection } from "./rewards";

export default function ClientDashboard() {
  return (
    <div className="w-full flex-1 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Minha Conta</h1>
        <div className="flex items-center gap-4">
          <UserCircle2 className="h-8 w-8 text-gray-600" />
          <Button variant="outline">Sair</Button>
        </div>
      </div>

      {/* Abas principais */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="reservas">Minhas Reservas</TabsTrigger>
          <TabsTrigger value="dados">Meus Dados</TabsTrigger>
          <TabsTrigger value="pontuacao">Pontuação</TabsTrigger>
        </TabsList>

        {/* Conteúdo das abas */}
        <TabsContent value="overview" className="space-y-4">
          <OverviewSection />
        </TabsContent>

        <TabsContent value="reservas">
          <ReservationsSection />
        </TabsContent>

        <TabsContent value="dados">
          <ProfileSection />
        </TabsContent>

        <TabsContent value="pontuacao">
          <RewardsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
