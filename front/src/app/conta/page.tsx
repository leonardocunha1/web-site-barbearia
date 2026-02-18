"use client";

import { useUser } from "@/contexts/user";
import ClientDashboard from "@/features/dashboard/cliente/components/dashboard";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Page() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Redireciona usuários não autenticados
    if (user === null) {
      toast.error("Você precisa estar logado para acessar esta área.");
      router.push("/");
      return;
    }

    // Redireciona profissionais e admins para seus dashboards
    if (user?.user.role === "PROFESSIONAL") {
      router.push("/dashboard/professional");
      return;
    }
    
    if (user?.user.role === "ADMIN") {
      router.push("/dashboard/admin");
      return;
    }
  }, [user, router]);

  // Apenas clientes veem esta página
  if (!user || user.user.role !== "CLIENT") {
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
