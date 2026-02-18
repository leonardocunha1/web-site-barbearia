"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/user";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push("/");
    } else if (user?.user.role === "PROFESSIONAL") {
      router.push("/dashboard/professional");
    } else if (user?.user.role === "ADMIN") {
      router.push("/dashboard/admin");
    } else if (user?.user.role === "CLIENT") {
      router.push("/conta");
    }
  }, [user, router]);

  return (
    <div className="w-full flex h-full items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Redirecionando...</h2>
      </div>
    </div>
  );
}
