"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRightIcon, ScissorsIcon } from "@phosphor-icons/react";
import { Button } from "@/shared/components/ui/button";

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

const metrics = [
  { label: "Fundação", value: "MMXXV" },
  { label: "Mestres", value: "04" },
  { label: "Cortes / mês", value: "+600" },
];

export default function Hero() {
  return (
    <motion.section
      className="relative w-full pt-6 pb-12 md:pt-12 md:pb-24"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Eyebrow */}
      <motion.div
        variants={fadeUp}
        className="mb-12 flex items-center gap-3 md:mb-20"
      >
        <ScissorsIcon weight="duotone" className="text-cobre-700 size-5" />
        <span className="text-foreground/70 font-mono text-[10px] tracking-[0.3em] uppercase">
          El Bigodón · Barber Shop · Est. MMXXV
        </span>
        <span className="bg-foreground/15 ml-3 h-px flex-1" aria-hidden />
        <span className="text-foreground/55 hidden font-mono text-[10px] tracking-[0.3em] uppercase sm:inline">
          Vol. 01
        </span>
      </motion.div>

      <div className="grid grid-cols-12 items-start gap-x-4 gap-y-10 md:gap-x-8">
        {/* Massive editorial headline */}
        <motion.h1
          variants={fadeUp}
          className="font-display text-foreground col-span-12 text-[clamp(3rem,9.4vw,9.5rem)] leading-[0.88] tracking-[-0.025em] md:col-span-8"
        >
          O templo
          <br />
          do{" "}
          <span className="text-cobre-700 italic [font-feature-settings:'ss01']">
            bom&nbsp;gosto
          </span>
          <br />
          masculino.
        </motion.h1>

        {/* Selo / wordmark */}
        <motion.aside
          variants={fadeUp}
          className="col-span-12 flex flex-col items-start gap-4 md:col-span-4 md:items-end"
        >
          <div className="relative aspect-square w-full max-w-[240px] md:max-w-[260px]">
            <div
              className="border-foreground/15 absolute inset-0 rounded-full border [background:radial-gradient(circle_at_center,transparent_62%,oklch(0.16_0.005_50/0.06)_63%,transparent_64%)]"
              aria-hidden
            />
            <Image
              src="/hero-sem-bg.png"
              alt="Selo El Bigodón Barber Shop"
              fill
              priority
              className="object-contain p-6"
              sizes="(max-width: 768px) 60vw, 22vw"
            />
          </div>
          <div className="md:text-right">
            <p className="text-foreground/55 font-mono text-[10px] tracking-[0.3em] uppercase">
              Selo de origem
            </p>
            <p className="font-display text-foreground mt-0.5 text-sm font-medium tracking-tight">
              N° 001 — Poços de Caldas
            </p>
          </div>
        </motion.aside>

        {/* Body + CTA */}
        <motion.div
          variants={fadeUp}
          className="col-span-12 md:col-span-7 md:col-start-1 md:mt-6"
        >
          <p className="text-foreground/80 max-w-[52ch] text-base leading-relaxed md:text-lg">
            Esqueça cortes apressados e barbeiros distraídos. Aqui a conversa
            é boa, o café é forte, e o cabelo sai no ponto. Bem-vindo ao
            último refúgio do cavalheiro contemporâneo.
          </p>

          <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <Link href="/agendar">
              <Button variant="editorial" size="xl" className="group gap-3">
                Agendar agora
                <ArrowRightIcon
                  className="transition-transform group-hover:translate-x-1"
                  weight="bold"
                />
              </Button>
            </Link>
            <Link
              href="#servicos"
              className="text-foreground/70 hover:text-foreground font-mono text-xs tracking-[0.25em] uppercase underline-offset-[6px] hover:underline"
            >
              ver a carta de serviços →
            </Link>
          </div>
        </motion.div>

        {/* Stats column */}
        <motion.dl
          variants={fadeUp}
          className="border-foreground/15 col-span-12 grid grid-cols-3 gap-x-4 border-t pt-6 md:col-span-4 md:col-start-9 md:mt-6 md:grid-cols-1 md:gap-y-5 md:pt-7"
        >
          {metrics.map((m) => (
            <div
              key={m.label}
              className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-4"
            >
              <dt className="text-foreground/55 font-mono text-[9px] tracking-[0.25em] uppercase md:text-[10px]">
                {m.label}
              </dt>
              <dd className="font-display text-foreground text-2xl leading-none font-medium tracking-tight md:text-3xl">
                {m.value}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </motion.section>
  );
}
