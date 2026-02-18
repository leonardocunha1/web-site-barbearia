"use client";

import { usePathname } from "next/navigation";
import Header from "@/features/marketing/menu/header";

export function ConditionalHeader() {
  const pathname = usePathname();
  
  // Não mostrar header nas rotas do dashboard
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }
  
  return <Header />;
}
