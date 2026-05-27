"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useUser } from "@/contexts/user";
import { BookingFormWizard } from "@/features/bookings";
import { Button } from "@/shared/components/ui/button";
import { UserCircleIcon } from "@phosphor-icons/react";
import { fadeInUp, staggerContainer } from "@/shared/animations/variants";

export default function Page() {
  const { user } = useUser();

  return (
    <section className="min-h-[calc(100vh-96px)] w-full px-4 pt-[124px] pb-16 sm:px-6 lg:px-10">
      <motion.div
        className="mx-auto flex w-full max-w-5xl flex-col gap-10"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Editorial header */}
        <motion.header variants={fadeInUp} className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="bg-foreground h-px w-10" aria-hidden />
            <span className="text-foreground/70 font-mono text-[10px] tracking-[0.25em] uppercase">
              Reserva · El Bigodón
            </span>
          </div>
          <h1 className="font-display text-foreground text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl md:text-6xl">
            Agende seu <span className="text-cobre-700 italic">horário</span>.
          </h1>
          <p className="text-foreground/70 max-w-prose text-sm sm:text-base">
            Quatro passos. Escolha o profissional, os serviços, o horário e
            confirme.
          </p>
        </motion.header>

        {/* Login banner (sem Card chamativo) */}
        {!user && (
          <motion.aside
            variants={fadeInUp}
            className="border-foreground bg-card flex flex-col items-start gap-4 border-l-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <UserCircleIcon
                weight="duotone"
                className="text-cobre-600 h-6 w-6"
              />
              <div className="flex flex-col">
                <p className="text-foreground text-sm font-medium">
                  Você precisa estar logado para confirmar.
                </p>
                <p className="text-foreground/60 font-mono text-[10px] tracking-widest uppercase">
                  Seus dados ficam salvos
                </p>
              </div>
            </div>
            <Button asChild variant="editorial" size="sm">
              <Link href="/login">Entrar ou criar conta</Link>
            </Button>
          </motion.aside>
        )}

        {/* Wizard — sem Card gradient laranja em cima */}
        <motion.div variants={fadeInUp}>
          <BookingFormWizard className="w-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
