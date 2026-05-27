"use client";

import Image from "next/image";
import Link from "next/link";
import { AuthButtons } from "./authbuttons";
import { MobileMenu } from "./mobile-menu";
import NavLink from "./navlink";
import { useUser } from "@/contexts/user";
import { motion, Variants } from "framer-motion";

const headerVariants: Variants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Header() {
  const { user } = useUser();

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 mx-auto w-full max-w-7xl px-4 py-3 sm:px-6 xl:px-0"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <nav className="border-foreground/15 bg-background/90 text-foreground flex items-center justify-between border px-4 py-2 backdrop-blur-md sm:px-5">
        {/* Logo + label */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-sem-escrita.png"
            alt="El Bigodón"
            width={1024}
            height={1024}
            className="size-11 sm:size-12"
            priority
          />
          <div className="hidden flex-col sm:flex">
            <span className="font-display text-foreground text-base leading-tight font-medium tracking-tight">
              El Bigodón
            </span>
            <span className="text-foreground/60 font-mono text-[9px] tracking-[0.25em] uppercase">
              Estd. MMXXIV
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden items-center gap-8 md:flex">
          <li>
            <NavLink href="/agendar">Agendar</NavLink>
          </li>
        </ul>

        {/* Auth */}
        <div className="hidden md:flex">
          <AuthButtons user={user?.user} />
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <MobileMenu user={user?.user} />
        </div>
      </nav>
    </motion.header>
  );
}
