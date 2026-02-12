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
import { SignInIcon, UserCircleIcon } from "@phosphor-icons/react";

export function MobileMenu({ user }: { user: unknown | null }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-principal-100 hover:bg-stone-100/50"
          aria-label="Abrir menu de navegação"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-72 border-l-stone-200/80 bg-stone-50 p-6"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="text-left font-serif text-xl text-stone-800">
            El Bigodón
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-3">
          <Link
            href="/services"
            className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-100 hover:text-amber-700"
          >
            ✂️ Agende seu horário
          </Link>

          <div className="my-2 border-t border-stone-200"></div>

          {!user ? (
            <Link href="/login">
              <Button
                variant="default"
                size="sm"
                className="w-full gap-2 bg-amber-600 font-medium text-white hover:bg-amber-700"
              >
                <SignInIcon className="size-4" />
                Entrar
              </Button>
            </Link>
          ) : (
            <Link href="/conta">
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 border-stone-300 font-medium text-stone-800 hover:bg-stone-100"
              >
                <UserCircleIcon className="size-4" />
                Minha conta
              </Button>
            </Link>
          )}
        </nav>

        {/* Rodapé do menu */}
        <div className="mt-auto border-t border-stone-200 pt-4 text-xs text-stone-500">
          © {new Date().getFullYear()} El Bigodón Barber
        </div>
      </SheetContent>
    </Sheet>
  );
}

