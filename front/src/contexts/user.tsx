"use client";

import React, { createContext, useContext, useState } from "react";
import { GetUsersMe200 } from "@/api";
import { useAuthValidation } from "@/hooks/useAuth";

type UserContextType = {
  user: GetUsersMe200 | null | undefined;
  setUser: (user: GetUsersMe200 | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser deve ser usado dentro de UserProvider");
  return ctx;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<GetUsersMe200 | null | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  // gerenciar a validação
  useAuthValidation(user, setUser, setIsLoading);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="border-principal-500 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-t-transparent">
            <span className="sr-only">Carregando...</span>
          </div>
          <p className="text-principal-600 mt-2 text-sm">Aguarde um momento</p>
        </div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
