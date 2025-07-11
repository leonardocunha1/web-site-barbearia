"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInIcon } from "@phosphor-icons/react";
import { GetUsersMe200 } from "@/api";
import { useEffect, useState } from "react";

export function AuthButtons({
  user,
}: {
  user: GetUsersMe200 | null | undefined;
}) {
  const [currentUser, setCurrentUser] = useState<
    GetUsersMe200 | null | undefined
  >(user);

  useEffect(() => {
    // Atualiza o estado local quando o prop user mudar
    setCurrentUser(user);
  }, [user]);

  console.log("AuthButtons user:", currentUser);

  // Enquanto está carregando (undefined), não renderiza nada
  if (currentUser === undefined) {
    return null;
  }

  // Se não estiver logado
  if (!currentUser) {
    return (
      <div className="flex items-center space-x-2">
        <Link href="/login">
          <Button
            variant="default"
            size="sm"
            className="text-principal-100 border-principal-900 cursor-pointer border"
          >
            Entrar
            <SignInIcon className="size-4" />
          </Button>
        </Link>
      </div>
    );
  }

  // Se estiver logado
  return (
    <Link href="/conta">
      <Button
        variant="default"
        size="sm"
        className="text-principal-100 border-principal-900 cursor-pointer border"
      >
        Minha conta
      </Button>
    </Link>
  );
}
