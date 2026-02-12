"use client";

import { ShinyButton } from "@/shared/components/magicui/shiny-button";
import { WordRotate } from "@/shared/components/magicui/word-rotate";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

export default function Hero() {
  const containerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.2 } },
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const fadeInLeft: Variants = {
    hidden: { opacity: 0, x: -40 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const fadeInRight: Variants = {
    hidden: { opacity: 0, x: 40 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section className="min-h-[calc(100vh-104px)] w-full py-12 md:py-16 ">
      <motion.div
        className="mx-auto max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <div className="grid min-h-[calc(100vh-104px-96px)] gap-8 md:grid-cols-2 md:items-center lg:gap-12">
          {/* Conteúdo de Texto */}
          <motion.div
            className="flex flex-col items-center space-y-6 text-center md:items-start md:space-y-8 md:text-start"
            variants={fadeInLeft}
          >
            <motion.h1
              className="text-sm font-medium tracking-widest text-stone-700 uppercase md:text-base"
              variants={fadeInUp}
            >
              El Bigodón Barber Shop
            </motion.h1>

            <motion.h2
              className="font-calistoga text-3xl leading-tight font-semibold text-stone-900 md:text-5xl xl:text-7xl"
              variants={fadeInUp}
            >
              Onde o estilo é clássico, e o{" "}
              <WordRotate
                words={["bigode", "cabelo"]}
                duration={5000}
                className="text-principal-600"
              />{" "}
              <span className="inline lg:block">é sagrado</span>
            </motion.h2>

            <motion.p
              className="max-w-md text-base leading-7 text-stone-600 lg:max-w-lg"
              variants={fadeInUp}
            >
              Esqueça cortes apressados e barbeiros distraídos. Aqui a conversa
              é boa, o café é forte, e o cabelo sai no ponto. Seja bem-vindo ao
              templo do bom gosto masculino.
            </motion.p>

            <motion.div className="pt-2" variants={fadeInUp}>
              <Link href="/services">
                <ShinyButton className="border-stone-900 px-8 py-3 text-lg font-medium">
                  Agende seu horário
                </ShinyButton>
              </Link>
            </motion.div>
          </motion.div>

          {/* Imagem */}
          <motion.div
            className="flex items-center justify-center"
            variants={fadeInRight}
          >
            <div className="relative aspect-square w-full max-w-[350px] md:max-w-[450px] lg:max-w-[500px]">
              <Image
                src="/hero-sem-bg.png"
                alt="Barbeiro profissional da El Bigodón Barber Shop"
                fill
                priority
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

