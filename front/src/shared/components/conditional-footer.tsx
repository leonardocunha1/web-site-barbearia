"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/shared/components/footer";

export function ConditionalFooter() {
  const pathname = usePathname();
  
  // Não mostrar footer nas rotas do dashboard
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }
  
  return <Footer />;
}
