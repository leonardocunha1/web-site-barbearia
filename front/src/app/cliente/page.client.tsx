"use client";

import ClientDashboard from "@/features/dashboard/cliente/components/dashboard";
import { LoadingState } from "@/shared/components/ui/loading-state";
import { useRouteProtection } from "@/shared/hooks/useRouteProtection";

export default function ClientDashboardPageClient() {
  const { user, isLoading } = useRouteProtection(["CLIENT"]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <LoadingState message="Carregando area do cliente" size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <section className="w-full flex-1 bg-stone-100 px-6 pt-[124px] pb-16 xl:px-0">
      <div className="mx-auto max-w-7xl">
        <ClientDashboard />
      </div>
    </section>
  );
}
