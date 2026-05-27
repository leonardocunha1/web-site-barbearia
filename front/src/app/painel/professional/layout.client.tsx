"use client";

import { DashboardShell } from "@/features/dashboard/layout/dashboard-shell";
import { LoadingState } from "@/shared/components/ui/loading-state";
import { useLogout } from "@/shared/hooks/useLogout";
import { useRouteProtection } from "@/shared/hooks/useRouteProtection";
import {
  ChartBarIcon,
  CalendarIcon,
  GearIcon,
  ClockIcon,
  UmbrellaIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";

export default function ProfessionalDashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useRouteProtection(["PROFESSIONAL"]);
  const { logout: handleLogout } = useLogout();

  if (isLoading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
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
      icon: ChartBarIcon,
      label: "Visão geral",
    },
    {
      href: "/painel/professional/bookings",
      icon: CalendarIcon,
      label: "Agendamentos",
    },
    {
      label: "Configurações",
      icon: GearIcon,
      items: [
        {
          href: "/painel/professional/settings/profile",
          icon: UserCircleIcon,
          label: "Perfil",
        },
        {
          href: "/painel/professional/settings/business-hours",
          icon: ClockIcon,
          label: "Horários",
        },
        {
          href: "/painel/professional/settings/holidays",
          icon: UmbrellaIcon,
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
