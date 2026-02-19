"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/shared/components/footer";

export function ConditionalFooter() {
  const pathname = usePathname();
  
  // Não mostrar footer nas rotas do painel
  if (pathname?.startsWith("/painel")) {
    return null;
  }
  
  return <Footer />;
}
