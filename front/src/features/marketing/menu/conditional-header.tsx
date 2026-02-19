"use client";

import { usePathname } from "next/navigation";
import Header from "@/features/marketing/menu/header";

export function ConditionalHeader() {
  const pathname = usePathname();
  
  // Não mostrar header nas rotas do painel
  if (pathname?.startsWith("/painel")) {
    return null;
  }
  
  return <Header />;
}
