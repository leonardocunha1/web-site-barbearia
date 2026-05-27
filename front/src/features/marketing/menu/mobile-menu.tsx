"use client";

import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/shared/components/ui/sheet";
import {
  SignInIcon,
  UserCircleIcon,
  ScissorsIcon,
} from "@phosphor-icons/react";
import { GetUserProfile200User } from "@/api";

export function MobileMenu({
  user,
}: {
  user: GetUserProfile200User | null | undefined;
}) {
  if (user === undefined) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="text-foreground hover:bg-foreground/5 animate-pulse"
        disabled
      >
        <Menu className="h-6 w-6" />
      </Button>
    );
  }

  const dashboardUrl = !user
    ? "/cliente"
    : user.role === "PROFESSIONAL"
      ? "/painel/professional"
      : user.role === "ADMIN"
        ? "/painel/admin"
        : "/cliente";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-foreground hover:bg-foreground/5"
          aria-label="Abrir menu de navegação"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="border-foreground/15 bg-background flex w-72 flex-col border-l p-6"
      >
        <SheetHeader className="mb-8 space-y-2 p-0 text-left">
          <div className="flex items-center gap-3">
            <span className="bg-foreground/60 h-px w-8" aria-hidden />
            <span className="text-foreground/70 font-mono text-[10px] tracking-[0.25em] uppercase">
              Menu
            </span>
          </div>
          <SheetTitle className="font-display text-foreground text-2xl font-medium tracking-tight">
            El Bigodón
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col">
          <Link
            href="/agendar"
            className="border-foreground/15 group hover:bg-foreground/5 flex items-center justify-between border-t border-b px-1 py-4 transition-colors"
          >
            <span className="flex items-center gap-3">
              <ScissorsIcon
                weight="duotone"
                className="text-cobre-700 h-5 w-5"
              />
              <span className="text-foreground text-sm font-medium">
                Agendar horário
              </span>
            </span>
            <span className="text-foreground/40 font-mono text-[10px] tracking-widest uppercase group-hover:text-cobre-700">
              →
            </span>
          </Link>
        </nav>

        <div className="mt-6">
          {!user ? (
            <Link href="/login">
              <Button
                variant="editorial"
                size="sm"
                className="w-full gap-2"
              >
                <SignInIcon className="size-4" weight="bold" />
                Entrar
              </Button>
            </Link>
          ) : (
            <Link href={dashboardUrl}>
              <Button variant="outline" size="sm" className="w-full gap-2">
                <UserCircleIcon className="size-4" weight="bold" />
                Minha conta
              </Button>
            </Link>
          )}
        </div>

        <div className="border-foreground/15 text-foreground/60 mt-auto border-t pt-4 font-mono text-[10px] tracking-widest uppercase">
          © {new Date().getFullYear()} · El Bigodón
        </div>
      </SheetContent>
    </Sheet>
  );
}
