"use client";

import { DashboardShell } from "@/features/dashboard/layout/dashboard-shell";
import { LoadingState } from "@/shared/components/ui/loading-state";
import { useLogout } from "@/shared/hooks/useLogout";
import { useRouteProtection } from "@/shared/hooks/useRouteProtection";
import {
  LayoutDashboard,
  Calendar,
  Settings,
  Clock,
  Briefcase,
  User,
} from "lucide-react";

export default function ProfessionalDashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useRouteProtection(["PROFESSIONAL"]);
  const { logout: handleLogout } = useLogout();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <LoadingState message="Carregando painel" size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const navigation = [
    {
      href: "/painel/professional",
      icon: LayoutDashboard,
      label: "Visao Geral",
    },
    {
      href: "/painel/professional/bookings",
      icon: Calendar,
      label: "Agendamentos",
    },
    {
      label: "Configuracoes",
      icon: Settings,
      items: [
        {
          href: "/painel/professional/settings/profile",
          icon: User,
          label: "Perfil",
        },
        {
          href: "/painel/professional/settings/business-hours",
          icon: Clock,
          label: "Horarios",
        },
        {
          href: "/painel/professional/settings/holidays",
          icon: Briefcase,
          label: "Feriados",
        },
      ],
    },
  ];

  return (
    <DashboardShell
      navigation={navigation}
      user={{
        name: user.user.name,
        email: user.user.email,
        avatar: undefined,
        role: "Profissional",
      }}
      onLogout={handleLogout}
    >
      {children}
    </DashboardShell>
  );
}
