"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, easeOut } from "framer-motion";
import { ArrowUpRightIcon } from "@phosphor-icons/react";

type Service = {
  id: number;
  title: string;
  subtitle: string;
};

const services: Service[] = [
  {
    id: 1,
    title: "Corte de Tesoura",
    subtitle: "Precisão artesanal, técnica tradicional.",
  },
  {
    id: 2,
    title: "Corte Tradicional",
    subtitle: "Máquina e tesoura — acabamento impecável.",
  },
  {
    id: 3,
    title: "Barba Premium",
    subtitle: "Toalha quente, navalha, óleos da casa.",
  },
  {
    id: 4,
    title: "Combo Bigodón",
    subtitle: "Corte + barba completos, sem pressa.",
  },
  {
    id: 5,
    title: "Corte Infantil",
    subtitle: "Para os pequenos cavalheiros da casa.",
  },
];

const gallery = [
  { src: "/cortes/imagem-3.jpg", alt: "Detalhe de corte profissional" },
  { src: "/cortes/corte-2.jpg", alt: "Acabamento clássico" },
  { src: "/cortes/corte-1.jpg", alt: "Barbeiro em ação" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

export default function Services() {
  return (
    <motion.section
      id="servicos"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={containerVariants}
      className="py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl">
        {/* Editorial header */}
        <motion.header
          variants={itemVariants}
          className="grid grid-cols-12 gap-x-4 gap-y-6 md:gap-x-8"
        >
          <div className="col-span-12 flex items-center gap-3 md:col-span-4">
            <span className="bg-foreground h-px w-8" aria-hidden />
            <span className="text-foreground/70 font-mono text-[10px] tracking-[0.3em] uppercase">
              A carta · Cap. 02
            </span>
          </div>
          <h2 className="font-display text-foreground col-span-12 text-5xl leading-[0.95] font-medium tracking-tight md:col-span-8 md:text-7xl lg:text-[5.5rem]">
            Nossos{" "}
            <span className="text-cobre-700 italic">serviços</span>,
            <br className="hidden md:block" /> sem floreio.
          </h2>
          <p className="text-foreground/70 col-span-12 max-w-[52ch] text-base md:col-span-7 md:col-start-6 md:text-lg">
            Cinco serviços, executados com método. Tempo certo, preço justo,
            mão firme. Sem upsell, sem pressa, sem desculpas.
          </p>
        </motion.header>

        {/* Printed menu */}
        <motion.ol
          variants={containerVariants}
          className="border-foreground/20 mt-16 border-t md:mt-20"
        >
          {services.map((service, index) => (
            <motion.li
              key={service.id}
              variants={itemVariants}
              className="group border-foreground/15 hover:bg-foreground/[0.025] relative border-b transition-colors"
            >
              <div className="flex items-baseline gap-4 px-1 py-7 sm:gap-8 sm:py-8">
                {/* Number */}
                <span className="text-foreground/40 w-8 shrink-0 font-mono text-[10px] tracking-[0.25em] uppercase sm:w-12">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Title + subtitle */}
                <div className="flex-1">
                  <h3 className="font-display text-foreground text-2xl leading-tight font-medium tracking-tight sm:text-3xl md:text-4xl">
                    {service.title}
                  </h3>
                  <p className="text-foreground/65 mt-1.5 text-sm sm:text-base">
                    {service.subtitle}
                  </p>
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ol>

        {/* Footnote + CTA */}
        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end"
        >
          <p className="text-foreground/55 max-w-md font-mono text-[10px] leading-relaxed tracking-[0.18em] uppercase">
            Cada barbeiro define o seu próprio preço e duração.
            <br />
            Confira valor e disponibilidade no agendamento.
          </p>
          <Link
            href="/agendar"
            className="group inline-flex items-center gap-2 font-mono text-xs tracking-[0.25em] uppercase underline-offset-[6px] hover:underline"
          >
            reservar minha cadeira
            <ArrowUpRightIcon
              weight="bold"
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </motion.div>

        {/* Gallery strip */}
        <motion.div
          variants={itemVariants}
          className="mt-20 grid grid-cols-12 gap-2 sm:gap-3 md:mt-28"
        >
          <div className="bg-foreground relative col-span-12 aspect-[5/4] overflow-hidden sm:col-span-7 sm:aspect-[4/3]">
            <Image
              src={gallery[0].src}
              alt={gallery[0].alt}
              fill
              sizes="(max-width: 640px) 100vw, 60vw"
              className="object-cover transition-transform duration-[1200ms] ease-out hover:scale-[1.04]"
            />
            <div className="text-background/85 absolute bottom-4 left-4 font-mono text-[10px] tracking-[0.3em] uppercase">
              Pl. 001 / Detalhe
            </div>
          </div>

          <div className="col-span-12 grid grid-cols-2 gap-2 sm:col-span-5 sm:grid-cols-1 sm:gap-3">
            {gallery.slice(1).map((g, i) => (
              <div
                key={g.src}
                className="bg-foreground relative aspect-[4/3] overflow-hidden sm:aspect-auto sm:flex-1"
              >
                <Image
                  src={g.src}
                  alt={g.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 35vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out hover:scale-[1.04]"
                />
                <div className="text-background/85 absolute bottom-3 left-3 font-mono text-[10px] tracking-[0.3em] uppercase">
                  Pl. {String(i + 2).padStart(3, "0")}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
