"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { AxiosError } from "axios";
import { Toaster } from "sonner";
import { minutes } from "@/shared/utils/time";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
      staleTime: minutes(0.1),
    },
  },
});

queryClient.getQueryCache().config.onError = (error) => {
  if (error instanceof AxiosError) {
    console.error("Query error:", error.message);
    if (error.response?.status === 401) {
      console.warn("Unauthorized access detected");
    }
  }
};

queryClient.getMutationCache().config.onError = (error) => {
  if (error instanceof AxiosError) {
    console.error("Mutation error:", error.message);
  }
};

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}

