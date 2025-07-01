"use client";

import { ReactNode } from "react";
import { ReactQueryProvider } from "@/contexts/query";
import { UserProvider } from "@/contexts/user";

export function ApplicationProviders({ children }: { children: ReactNode }) {
  return (
    <ReactQueryProvider>
      <UserProvider>{children}</UserProvider>
    </ReactQueryProvider>
  );
}
