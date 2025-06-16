import Image from "next/image";
import Link from "next/link";
import { AuthButtons } from "./authbuttons";
import { MobileMenu } from "./mobile-menu";
import NavLink from "./navlink";

export default async function Header() {
  const user = false;

  return (
    <header className="mx-auto w-full max-w-7xl px-4 py-2">
      <nav className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-2 font-medium shadow-md">
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
          <AuthButtons user={user} />
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <MobileMenu user={user} />
        </div>
      </nav>
    </header>
  );
}
