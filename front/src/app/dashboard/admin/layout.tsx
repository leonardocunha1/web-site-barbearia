"use client";

import { DashboardShell } from "@/features/dashboard/layout/dashboard-shell";
import { useLogout } from "@/shared/hooks/useLogout";
import { useRouteProtection } from "@/shared/hooks/useRouteProtection";
import {
  LayoutDashboard,
  Users,
  Scissors,
  Ticket,
} from "lucide-react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useRouteProtection(["ADMIN"]);
  const { logout: handleLogout } = useLogout();

  if (!user) {
    return null;
  }

  const navigation = [
    {
      href: "/dashboard/admin",
      icon: LayoutDashboard,
      label: "Visão Geral",
    },
    {
      href: "/dashboard/admin/professionals",
      icon: Users,
      label: "Funcionários",
    },
    {
      href: "/dashboard/admin/services",
      icon: Scissors,
      label: "Serviços",
    },
    {
      href: "/dashboard/admin/coupons",
      icon: Ticket,
      label: "Cupons",
    },
  ];

  return (
    <DashboardShell
      navigation={navigation}
      user={{
        name: user.user.name,
        email: user.user.email,
        avatar: undefined,
        role: "Administrador",
      }}
      onLogout={handleLogout}
    >
      {children}
    </DashboardShell>
  );
}
