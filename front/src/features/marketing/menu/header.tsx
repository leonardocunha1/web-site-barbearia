"use client";

import Image from "next/image";
import Link from "next/link";
import { AuthButtons } from "./authbuttons";
import { MobileMenu } from "./mobile-menu";
import NavLink from "./navlink";
import { useUser } from "@/contexts/user";
import { motion, Variants } from "framer-motion";

export default function Header() {
  const user = useUser();

  // Variantes de animação do header
  const headerVariants: Variants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <motion.header
      className="fixed right-0 left-0 z-50 mx-auto w-full max-w-7xl px-6 py-4 xl:px-0"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <nav className="flex items-center justify-between rounded-2xl bg-stone-900 px-4 py-2 font-medium text-stone-200 shadow-lg">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/logo-sem-escrita.png"
            alt="Logo"
            width={1024}
            height={1024}
            className="size-16 rounded-full"
            priority
          />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden items-center space-x-6 tracking-wider md:flex">
          <li>
            <NavLink href="/services">Agende seu horário!</NavLink>
          </li>
        </ul>

        {/* Botões de autenticação */}
        <div className="hidden md:flex">
          <AuthButtons user={user.user} />
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <MobileMenu user={user.user} />
        </div>
      </nav>
    </motion.header>
  );
}
