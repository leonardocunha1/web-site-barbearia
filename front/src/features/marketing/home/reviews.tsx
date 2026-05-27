"use client";

import { motion, easeOut } from "framer-motion";
import { StarIcon, QuotesIcon } from "@phosphor-icons/react";

type Review = {
  id: number;
  name: string;
  role: string;
  text: string;
  rating: number;
  date: string;
};

const reviews: Review[] = [
  {
    id: 1,
    name: "Lucas Almeida",
    role: "Cliente desde 2025",
    text: "Corte impecável, atendimento de primeira e o ambiente respira detalhe. Saí com a sensação de ter sido ouvido — coisa rara em barbearia.",
    rating: 5,
    date: "Abr · 2026",
  },
  {
    id: 2,
    name: "Rafael Santos",
    role: "Recorrente",
    text: "Atendido pelo João e voltei novo em folha. Barba feita no capricho, navalha respeitando o rosto. Voltarei sem pestanejar.",
    rating: 5,
    date: "Mar · 2026",
  },
  {
    id: 3,
    name: "Pedro Henrique",
    role: "Cliente novo",
    text: "Excelente experiência. O barbeiro entende exatamente o que você quer, sugere quando faz sentido e respeita quando você prefere o seu estilo.",
    rating: 5,
    date: "Fev · 2026",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
};

export default function Reviews() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={containerVariants}
      className="py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.header
          variants={itemVariants}
          className="grid grid-cols-12 gap-x-4 gap-y-6 md:gap-x-8"
        >
          <div className="col-span-12 flex items-center gap-3 md:col-span-4">
            <span className="bg-foreground h-px w-8" aria-hidden />
            <span className="text-foreground/70 font-mono text-[10px] tracking-[0.3em] uppercase">
              Coluna social · Cap. 05
            </span>
          </div>
          <h2 className="font-display text-foreground col-span-12 text-5xl leading-[0.95] font-medium tracking-tight md:col-span-8 md:text-7xl lg:text-[5.5rem]">
            O que dizem na{" "}
            <span className="text-cobre-700 italic">cadeira</span>.
          </h2>
          <div className="col-span-12 flex flex-col gap-3 md:col-span-7 md:col-start-6">
            <p className="text-foreground/70 max-w-[52ch] text-base md:text-lg">
              Coletado da boca de quem senta, conversa, e volta. Sem retoque,
              sem filtro.
            </p>
            <div className="text-foreground/55 mt-1 flex items-center gap-3 font-mono text-[10px] tracking-[0.25em] uppercase">
              <span className="bg-foreground/30 inline-block h-px w-6" />
              <span>Nota geral · 4,9 / 5,0</span>
            </div>
          </div>
        </motion.header>

        {/* Newspaper-style 3-col quotes */}
        <motion.div
          variants={containerVariants}
          className="border-foreground/20 mt-16 grid grid-cols-1 border-t md:mt-20 md:grid-cols-3"
        >
          {reviews.map((review, idx) => (
            <motion.article
              key={review.id}
              variants={itemVariants}
              className={`border-foreground/15 relative flex flex-col gap-6 border-b px-2 py-9 md:px-6 md:py-10 ${
                idx !== 0 ? "md:border-l" : ""
              }`}
            >
              {/* topbar */}
              <header className="flex items-center justify-between">
                <span className="text-foreground/45 font-mono text-[10px] tracking-[0.25em] uppercase">
                  Depoimento {String(idx + 1).padStart(2, "0")}
                </span>
                <QuotesIcon
                  weight="fill"
                  className="text-cobre-600 size-5"
                />
              </header>

              {/* quote with drop cap */}
              <blockquote className="font-display text-foreground flex-1 text-xl leading-[1.45] tracking-tight md:text-2xl">
                <span className="font-display text-cobre-700 float-left mt-1 mr-3 text-6xl leading-[0.8] font-medium">
                  {review.text.charAt(0)}
                </span>
                {review.text.slice(1)}
              </blockquote>

              {/* footer */}
              <footer className="border-foreground/15 mt-auto flex items-end justify-between border-t pt-4">
                <div>
                  <p className="font-display text-foreground text-base font-medium tracking-tight">
                    {review.name}
                  </p>
                  <p className="text-foreground/55 font-mono text-[10px] tracking-[0.25em] uppercase">
                    {review.role}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon
                        key={i}
                        weight={i < review.rating ? "fill" : "regular"}
                        className={
                          i < review.rating
                            ? "text-cobre-600 size-3.5"
                            : "text-foreground/20 size-3.5"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-foreground/45 font-mono text-[9px] tracking-[0.25em] uppercase">
                    {review.date}
                  </span>
                </div>
              </footer>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
