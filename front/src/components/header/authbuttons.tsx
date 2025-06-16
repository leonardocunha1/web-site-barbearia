"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInIcon } from "@phosphor-icons/react";

export function AuthButtons({ user }: { user: unknown | null }) {
  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Link href="/login">
          <Button variant="default" size="sm" className="cursor-pointer">
            Entrar
            <SignInIcon className="size-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <Link href="/dashboard">
      <Button variant="default" size="sm" className="cursor-pointer">
        Meu Painel
      </Button>
    </Link>
  );
}
