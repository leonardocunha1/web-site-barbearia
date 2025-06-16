"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SignInIcon } from "@phosphor-icons/react";

export function MobileMenu({ user }: { user: unknown | null }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-64 p-4">
        <SheetHeader className="hidden">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="mt-4 flex flex-col gap-4">
          <Link
            href="/services"
            className="text-sm font-medium text-stone-800 transition-colors hover:text-amber-700"
          >
            Agende seu horário!
          </Link>

          {!user ? (
            <>
              <Link href="/login">
                <Button variant="default" size="sm" className="w-full">
                  Entrar
                  <SignInIcon className="size-4" />
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/dashboard">
              <Button variant="default" size="sm" className="w-full">
                Meu Painel
              </Button>
            </Link>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
