"use client";

import Link from "next/link";
import { motion, easeOut } from "framer-motion";
import {
  CrownIcon,
  StarIcon,
  CreditCardIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react";
import { Button } from "@/shared/components/ui/button";

const offerings = [
  {
    title: "Programa Bigodón VIP",
    emphasis: "Estilo recompensado.",
    description:
      "Cada serviço acumula pontos que viram descontos, cortes na casa e experiências exclusivas para membros do clube.",
    Icon: CrownIcon,
  },
  {
    title: "Preço justo, mão premium",
    emphasis: "Sem fórmula mágica.",
    description:
      "Bom corte não precisa ser caro — só precisa ser bem feito. Tabela transparente, sem upsell, sem surpresa.",
    Icon: CreditCardIcon,
  },
  {
    title: "Excelência em cada detalhe",
    emphasis: "Obsessão pelo acabamento.",
    description:
      "Profissionais especialistas, ferramentas afiadas e produtos selecionados. Aqui o detalhe importa.",
    Icon: StarIcon,
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: easeOut },
  },
};

export default function BecomeBigodon() {
  return (
    <section className="bg-foreground text-background relative w-full overflow-hidden">
      {/* paper-grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
          backgroundSize: "5px 5px",
        }}
        aria-hidden
      />
      {/* corner cobre glow */}
      <div
        className="bg-cobre-700/25 pointer-events-none absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full blur-3xl"
        aria-hidden
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="relative mx-auto max-w-7xl px-6 py-24 sm:px-8 sm:py-32"
      >
        {/* Header */}
        <motion.header
          variants={itemVariants}
          className="grid grid-cols-12 gap-x-4 gap-y-6 md:gap-x-8"
        >
          <div className="col-span-12 flex items-center gap-3 md:col-span-4">
            <span className="bg-cobre-500 h-px w-8" aria-hidden />
            <span className="text-background/65 font-mono text-[10px] tracking-[0.3em] uppercase">
              O clube · Cap. 03
            </span>
          </div>
          <h2 className="font-display text-background col-span-12 text-5xl leading-[0.95] font-medium tracking-tight md:col-span-8 md:text-7xl lg:text-[5.5rem]">
            Seja parte da{" "}
            <span className="text-cobre-400 italic">elite</span>.
          </h2>
        </motion.header>

        {/* Membership card */}
        <motion.div
          variants={itemVariants}
          className="relative mt-14 md:mt-20"
        >
          <div className="border-background/20 relative grid grid-cols-12 gap-x-4 border md:gap-x-0">
            {/* card-corner markers */}
            <CornerMark className="-top-px -left-px" />
            <CornerMark className="-top-px -right-px rotate-90" />
            <CornerMark className="-bottom-px -left-px -rotate-90" />
            <CornerMark className="-right-px -bottom-px rotate-180" />

            {/* Left — seal column */}
            <div className="border-background/15 col-span-12 flex flex-col justify-between gap-10 p-8 md:col-span-4 md:border-r md:p-10">
              <div>
                <p className="text-background/55 font-mono text-[10px] tracking-[0.3em] uppercase">
                  Convite n° 0001
                </p>
                <p className="font-display text-background mt-1 text-xl font-medium tracking-tight">
                  El Bigodón · Members
                </p>
              </div>

              <div className="relative flex items-center justify-center py-6 md:py-10">
                <div
                  className="border-cobre-400/40 absolute inset-0 m-auto aspect-square w-[78%] rounded-full border"
                  aria-hidden
                />
                <div
                  className="border-cobre-400/20 absolute inset-0 m-auto aspect-square w-[94%] rounded-full border"
                  aria-hidden
                />
                <CrownIcon
                  weight="duotone"
                  className="text-cobre-400 size-20 md:size-24"
                />
              </div>

              <div>
                <p className="text-background/55 font-mono text-[10px] tracking-[0.3em] uppercase">
                  Válido enquanto durar
                </p>
                <p className="font-display text-background mt-1 text-xl font-medium tracking-tight">
                  o bom gosto.
                </p>
              </div>
            </div>

            {/* Right — three benefits */}
            <ol className="divide-background/15 col-span-12 divide-y md:col-span-8">
              {offerings.map((offering, idx) => {
                const ItemIcon = offering.Icon;
                return (
                  <li
                    key={offering.title}
                    className="group hover:bg-background/[0.03] flex flex-col gap-4 px-8 py-8 transition-colors sm:flex-row sm:items-start sm:gap-8 md:px-10 md:py-9"
                  >
                    <div className="flex items-center justify-between sm:w-24 sm:flex-col sm:items-start sm:gap-5">
                      <span className="text-background/45 font-mono text-[11px] tracking-[0.25em]">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <ItemIcon
                        weight="duotone"
                        className="text-cobre-400 size-7"
                      />
                    </div>

                    <div className="flex-1 space-y-2.5">
                      <h3 className="font-display text-background text-2xl leading-tight font-medium tracking-tight sm:text-3xl">
                        {offering.title}
                      </h3>
                      <p className="text-background/70 max-w-prose text-sm leading-relaxed sm:text-base">
                        <span className="text-cobre-400 mr-1 font-medium">
                          {offering.emphasis}
                        </span>
                        {offering.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </motion.div>

        {/* Bottom action */}
        <motion.div
          variants={itemVariants}
          className="mt-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center"
        >
          <p className="text-background/65 max-w-md text-sm md:text-base">
            Sem mensalidade, sem letra miúda. Você é cliente, automaticamente
            é Bigodón.
          </p>
          <Link href="/agendar">
            <Button
              variant="outline"
              size="xl"
              className="group border-cobre-400 text-background hover:bg-cobre-400 hover:text-foreground gap-3 rounded-none border-2 text-xs tracking-[0.18em] uppercase"
            >
              Quero meu lugar
              <ArrowRightIcon
                weight="bold"
                className="transition-transform group-hover:translate-x-1"
              />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

function CornerMark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute ${className}`}
      style={{
        width: 14,
        height: 14,
      }}
    >
      <span className="bg-cobre-400 absolute top-0 left-0 h-px w-full" />
      <span className="bg-cobre-400 absolute top-0 left-0 h-full w-px" />
    </span>
  );
}
