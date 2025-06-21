"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { minutes } from "@/utils/time";
import { AxiosError } from "axios";

export function ApplicationProviders({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
        refetchOnWindowFocus: false,
        staleTime: minutes(0.1),
      },
    },
  });

  // Configuração global de erro para queries
  queryClient.getQueryCache().config.onError = (error) => {
    if (error instanceof AxiosError) {
      console.error("Query error:", error.message);
      if (error.response?.status === 401) {
        console.warn("Unauthorized access detected");
      }
    }
  };

  // Configuração global de erro para mutations
  queryClient.getMutationCache().config.onError = (error) => {
    if (error instanceof AxiosError) {
      console.error("Mutation error:", error.message);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
