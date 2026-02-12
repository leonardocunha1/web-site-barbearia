"use client";

import React, { createContext, useContext, useState } from "react";
import { GetUserProfile200 } from "@/api";
import { useAuthValidation } from "@/shared/hooks/useAuth";

type UserContextType = {
  user: GetUserProfile200 | null | undefined;
  setUser: React.Dispatch<
    React.SetStateAction<GetUserProfile200 | null | undefined>
  >;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser deve ser usado dentro de UserProvider");
  return ctx;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<GetUserProfile200 | null | undefined>();
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
