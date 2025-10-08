"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

export function useTabState(defaultTab: string = 'overview') {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const currentTab = searchParams.get('tab') || defaultTab;

  const setTab = useCallback((tab: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (tab === currentTab) return;
    
    // Limpa todos os parâmetros ao mudar de tab
    params.set('tab', tab);
    
    // Remove todos os parâmetros exceto 'tab'
    searchParams.forEach((_, key) => {
      if (key !== 'tab') {
        params.delete(key);
      }
    });
    
    router.replace(`${pathname}?${params.toString()}`);
  }, [searchParams, currentTab, pathname, router]);

  return { currentTab, setTab };
}