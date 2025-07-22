"use client";

import { useState } from "react";
import { UserCircle2, Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OverviewSection } from "./overview";
import { ReservationsSection } from "./reservation";
import { ProfileSection } from "./profile";
import { RewardsSection } from "./rewards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ClientDashboard() {
  const [tab, setTab] = useState("overview");

  return (
    <div className="w-full flex-1 space-y-4 px-4 lg:px-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Minha Conta</h1>
        <div className="flex items-center gap-4">
          <UserCircle2 className="h-8 w-8 text-gray-600" />
          <Button variant="outline">Sair</Button>
        </div>
      </div>

      {/* Tabs com valor controlado */}
      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <div className="flex items-center gap-2">
          {/* Desktop: scroll com tabs */}
          <ScrollArea className="hidden w-full md:block">
            <TabsList className="inline-flex flex-nowrap">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="reservas">Minhas Reservas</TabsTrigger>
              <TabsTrigger value="dados">Meus Dados</TabsTrigger>
              <TabsTrigger value="pontuacao">Pontuação</TabsTrigger>
            </TabsList>
          </ScrollArea>

          {/* Mobile: dropdown */}
          <div className="w-full md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <div className="flex items-center">
                    <Menu className="mr-2 h-4 w-4" />
                    {tab === "overview" && "Visão Geral"}
                    {tab === "reservas" && "Minhas Reservas"}
                    {tab === "dados" && "Meus Dados"}
                    {tab === "pontuacao" && "Pontuação"}
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-full">
                <DropdownMenuItem onClick={() => setTab("overview")}>
                  Visão Geral
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTab("reservas")}>
                  Minhas Reservas
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTab("dados")}>
                  Meus Dados
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTab("pontuacao")}>
                  Pontuação
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

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
