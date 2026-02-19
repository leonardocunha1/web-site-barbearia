"use client";

import { DashboardShell } from "@/features/dashboard/layout/dashboard-shell";
import { LoadingState } from "@/shared/components/ui/loading-state";
import { useLogout } from "@/shared/hooks/useLogout";
import { useRouteProtection } from "@/shared/hooks/useRouteProtection";
import { LayoutDashboard, Users, Scissors, Ticket } from "lucide-react";

export default function AdminDashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useRouteProtection(["ADMIN"]);
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
      href: "/painel/admin",
      icon: LayoutDashboard,
      label: "Visão Geral",
    },
    {
      href: "/painel/admin/professionals",
      icon: Users,
      label: "Funcionários",
    },
    {
      href: "/painel/admin/services",
      icon: Scissors,
      label: "Serviços",
    },
    {
      href: "/painel/admin/coupons",
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
