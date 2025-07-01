"use client";

import Image from "next/image";
import Link from "next/link";
import { AuthButtons } from "./authbuttons";
import { MobileMenu } from "./mobile-menu";
import NavLink from "./navlink";
import { useUser } from "@/contexts/user";

export default function Header() {
  const user = useUser();

  return (
    <header className="fixed right-0 left-0 z-50 mx-auto w-full max-w-7xl px-6 py-4 xl:px-0">
      <nav className="text-principal-100 flex items-center justify-between rounded-2xl bg-stone-900 px-4 py-2 font-medium shadow-lg">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/logo-sem-escrita.png"
            alt="Logo"
            width={1024}
            height={1024}
            className="size-14 rounded-full"
            priority
          />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden items-center space-x-6 md:flex">
          <li>
            <NavLink href="/services">Agende seu horário!</NavLink>
          </li>
        </ul>

        {/* Botões de autenticação*/}
        <div className="hidden md:flex">
          <AuthButtons user={user.user} />
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <MobileMenu user={user.user} />
        </div>
      </nav>
    </header>
  );
}
