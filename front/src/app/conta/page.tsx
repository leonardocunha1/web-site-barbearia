"use client";

import { useUser } from "@/contexts/user";
import AdminDashboard from "@/features/conta/admin/dashboard";
import ClientDashboard from "@/features/conta/cliente/dashboard";
import ProfessionalDashboard from "@/features/conta/professional/dashboard";

export default function Page() {
  const { user } = useUser();

  return (
    <section className="w-full flex-1 bg-stone-100 px-6 pt-[124px] pb-16 xl:px-0">
      <div className="mx-auto max-w-7xl">
        {user?.user.role === "CLIENTE" && <ClientDashboard />}
        {user?.user.role === "PROFISSIONAL" && <ProfessionalDashboard />}
        {user?.user.role === "ADMIN" && <AdminDashboard />}
      </div>
    </section>
  );
}
