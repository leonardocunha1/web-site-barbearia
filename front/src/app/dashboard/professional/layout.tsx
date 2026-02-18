"use client";

import { DashboardShell } from "@/features/dashboard/layout/dashboard-shell";
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

export default function ProfessionalDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useRouteProtection(["PROFESSIONAL"]);
  const { logout: handleLogout } = useLogout();

  if (!user) {
    return null;
  }

  const navigation = [
    {
      href: "/dashboard/professional",
      icon: LayoutDashboard,
      label: "Visão Geral",
    },
    {
      href: "/dashboard/professional/bookings",
      icon: Calendar,
      label: "Agendamentos",
    },
    {
      label: "Configurações",
      icon: Settings,
      items: [
        {
          href: "/dashboard/professional/settings/profile",
          icon: User,
          label: "Perfil",
        },
        {
          href: "/dashboard/professional/settings/business-hours",
          icon: Clock,
          label: "Horários",
        },
        {
          href: "/dashboard/professional/settings/holidays",
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
