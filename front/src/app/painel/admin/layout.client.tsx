"use client";

import { DashboardShell } from "@/features/dashboard/layout/dashboard-shell";
import { LoadingState } from "@/shared/components/ui/loading-state";
import { useLogout } from "@/shared/hooks/useLogout";
import { useRouteProtection } from "@/shared/hooks/useRouteProtection";
import {
  ChartBarIcon,
  UsersIcon,
  ScissorsIcon,
  TicketIcon,
} from "@phosphor-icons/react";

export default function AdminDashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useRouteProtection(["ADMIN"]);
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
      href: "/painel/admin",
      icon: ChartBarIcon,
      label: "Visão geral",
    },
    {
      href: "/painel/admin/professionals",
      icon: UsersIcon,
      label: "Funcionários",
    },
    {
      href: "/painel/admin/services",
      icon: ScissorsIcon,
      label: "Serviços",
    },
    {
      href: "/painel/admin/coupons",
      icon: TicketIcon,
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
