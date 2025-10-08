"use client";

import React from "react";
import { CrownIcon, StarIcon, CreditCardIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { motion, easeOut, easeInOut } from "framer-motion";

const offerings = [
  {
    title: "Programa Bigodón VIP",
    description:
      "A cada serviço, você acumula pontos que se transformam em descontos, serviços gratuitos e experiências exclusivas. Sua fidelidade é o nosso maior valor.",
    emphasis: "Seu estilo recompensado.",
    icon: <CrownIcon size={32} weight="fill" className="text-secondary-500" />,
  },
  {
    title: "Preço Justo, Qualidade Premium",
    description:
      "Acreditamos que cuidar do seu visual não precisa custar uma fortuna. Oferecemos o melhor serviço da cidade com preços competitivos, garantindo o melhor custo-benefício.",
    emphasis: "Economia e elegância.",
    icon: (
      <CreditCardIcon size={32} weight="fill" className="text-secondary-500" />
    ),
  },
  {
    title: "Excelência em Cada Detalhe",
    description:
      "Nossos profissionais são especialistas em cortes e barbas, usando técnicas avançadas e produtos de alta performance. Seu visual impecável do início ao fim.",
    emphasis: "O melhor para o seu visual.",
    icon: <StarIcon size={32} weight="fill" className="text-secondary-500" />,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3, 
    },
  },
};

const imageVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    rotate: -5,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.8,
      ease: easeOut, 
    },
  },
};

const titleVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: easeOut, 
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    x: -60,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: easeOut
    },
  },
};

export default function SejaUmBigodon() {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 100"
        className="-mb-1 w-full rotate-180"
      >
        <path
          d="M0 0v47.6l5-2c1 0 11 3 12 0 2 3 6-3 6 0 0-4 12 3 12 0 0 3 15-1 17 0 2-2 5-1 6 0 0-2 6 2 6 0s2 4 4 0c5 2 12-3 16 0 2-2 4-3 4 0 0 2 6-1 6 0 1 4 15-2 17 0h7c0 1 3-3 6 0h17c2 2 3 1 6 0h6c1-2 21-1 24 0 2 1 4 2 6 0 0-1 22 4 24 0 0 0 5-3 5 0 2-2 10 2 12 0 2 2 6 1 6 0 2 3 4-2 6 0 1 0 25-2 25 1l10-1c3 1 6 6 7 0 1 5 4-2 6 0 2-2 4 3 5 0h12c6 1 36 2 36 0 0 2 3 0 6 0h6c5-2 7 4 11 0 2 0 15 2 17 0h13c3-4 5 1 7 0h29c0-3 6 0 6 0h5c0 2 16-1 18 0 1 4 9-1 12 0s6-2 6 0c8-2 3 4 13 0h10c3 4 19 1 19 0 2 0 21 1 23-1 1 4 3-1 6 1 1 2 11-1 12-1 3 3 9 0 12 1 3-4 6 1 6 0h6c0-3 5 1 6-1 0 3 2 1 4 1 3 4 10-1 13 0 3-2 6-1 6 0 2 2 2 0 6 0 1-2 6 2 6 0 2 0 4 5 6 0h18c2 3 4 1 6 0l6-1c3 2 12 3 17 1 14 3 18 1 24 0 2-1 3 3 5 0 6 2 10-1 16 0 1 3 6 0 9 0 0-2 3 2 5 0 6-6 8 7 13 0 0-2 5 2 5 0 3 3 10 0 10 0 1 2 5-2 8 0 3-1 8 3 12 0h6c2 1 10 4 12 0h6c1-1 5 2 6 0 1 2 4-1 6 0 0-2 5 3 6-1 2 1 6 5 5 1 1 1 3-2 6 0 2-1 5 3 6 0 0 1 6 2 6 0 2 3 4-4 6 0 0-2 3 2 6 0 3 0 6 3 6 0 5 3 8-1 13 0 3-4 6 1 6 0h5c0-1 9 2 12 0 1-1 9 3 11 0h6c2 2 4 4 7 0 3 2 5-4 5-1 10 4 15-2 18 2 0-1 6 2 6-2 0 0 6-2 6 1 1 6 12 2 12 0 1 3 4-3 7 2 2-2 5 2 5 0 1 5 4-5 6 0 2-1 4 2 6 0 1 3 1 0 5 0V0H0Z"
          fill="#1c1917"
        ></path>
      </svg>

      <section className="ssm:py-24 -m-10 w-full bg-stone-900 px-8 py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24">
          {/* Esquerda */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }} // once: false para reanimar sempre
            className="space-y-8 lg:sticky lg:top-8 lg:h-fit"
          >
            <motion.div className="space-y-6" variants={titleVariants}>
              <span className="text-principal-500 text-sm font-semibold tracking-wider uppercase">
                Onde seu estilo encontra a excelência
              </span>
              <h2 className="font-calistoga pt-5 text-5xl font-bold text-stone-100 sm:text-6xl">
                Seja parte da <span className="text-principal-500">elite</span>.
              </h2>
              <p className="max-w-lg text-base text-stone-400">
                Três motivos para você elevar seu visual e fazer parte do clube
                Bigodón.
              </p>
            </motion.div>

            <motion.div
              variants={imageVariants}
              viewport={{ once: false, amount: 0.3 }} // once: false para reanimar sempre
              className="mt-8"
            >
              <Image
                src="/info-img.png"
                alt="Barber pole"
                width={1024}
                height={1536}
                className="mx-auto w-full max-w-[200px] rounded-2xl object-cover  md:max-w-[300px]"
              />
            </motion.div>
          </motion.div>

          {/* Direita */}
          <motion.div
            className="relative md:pl-8 lg:pl-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }} // once: false para reanimar sempre
          >
            <div className="hidden sm:block absolute inset-y-0 left-6 w-1 rounded-full bg-gradient-to-b from-amber-500 via-amber-700 to-amber-900 shadow-lg"></div>

            <div className="space-y-16 text-justify">
              {offerings.map((offering, idx) => (
                <motion.div
                  key={idx}
                  variants={cardVariants}
                  className="group relative flex cursor-pointer items-start gap-6 rounded-xl bg-stone-900  ring-1 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                >
                  <motion.div
                    whileHover={{
                      rotate: [0, -8, 8, 0],
                      transition: { duration: 0.5, ease: easeInOut }, // ✅
                    }}
                    className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-stone-800 p-3 shadow-inner"
                  >
                    {offering.icon}
                    <span className="bg-principal-500 hidden lg:block absolute top-1/2 -left-6 h-4 w-4 -translate-y-1/2 rounded-full shadow-lg transition-transform duration-300 group-hover:scale-110"></span>
                  </motion.div>

                  <div className="flex-1">
                    <h3 className="font-calistoga text-lg font-bold tracking-wider text-stone-100">
                      {offering.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-stone-300">
                      <span className="text-principal-500 font-semibold">
                        {offering.emphasis}
                      </span>{" "}
                      {offering.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100">
        <path
          d="M0 0v47.6l5-2c1 0 11 3 12 0 2 3 6-3 6 0 0-4 12 3 12 0 0 3 15-1 17 0 2-2 5-1 6 0 0-2 6 2 6 0s2 4 4 0c5 2 12-3 16 0 2-2 4-3 4 0 0 2 6-1 6 0 1 4 15-2 17 0h7c0 1 3-3 6 0h17c2 2 3 1 6 0h6c1-2 21-1 24 0 2 1 4 2 6 0 0-1 22 4 24 0 0 0 5-3 5 0 2-2 10 2 12 0 2 2 6 1 6 0 2 3 4-2 6 0 1 0 25-2 25 1l10-1c3 1 6 6 7 0 1 5 4-2 6 0 2-2 4 3 5 0h12c6 1 36 2 36 0 0 2 3 0 6 0h6c5-2 7 4 11 0 2 0 15 2 17 0h13c3-4 5 1 7 0h29c0-3 6 0 6 0h5c0 2 16-1 18 0 1 4 9-1 12 0s6-2 6 0c8-2 3 4 13 0h10c3 4 19 1 19 0 2 0 21 1 23-1 1 4 3-1 6 1 1 2 11-1 12-1 3 3 9 0 12 1 3-4 6 1 6 0h6c0-3 5 1 6-1 0 3 2 1 4 1 3 4 10-1 13 0 3-2 6-1 6 0 2 2 2 0 6 0 1-2 6 2 6 0 2 0 4 5 6 0h18c2 3 4 1 6 0l6-1c3 2 12 3 17 1 14 3 18 1 24 0 2-1 3 3 5 0 6 2 10-1 16 0 1 3 6 0 9 0 0-2 3 2 5 0 6-6 8 7 13 0 0-2 5 2 5 0 3 3 10 0 10 0 1 2 5-2 8 0 3-1 8 3 12 0h6c2 1 10 4 12 0h6c1-1 5 2 6 0 1 2 4-1 6 0 0-2 5 3 6-1 2 1 6 5 5 1 1 1 3-2 6 0 2-1 5 3 6 0 0 1 6 2 6 0 2 3 4-4 6 0 0-2 3 2 6 0 3 0 6 3 6 0 5 3 8-1 13 0 3-4 6 1 6 0h5c0-1 9 2 12 0 1-1 9 3 11 0h6c2 2 4 4 7 0 3 2 5-4 5-1 10 4 15-2 18 2 0-1 6 2 6-2 0 0 6-2 6 1 1 6 12 2 12 0 1 3 4-3 7 2 2-2 5 2 5 0 1 5 4-5 6 0 2-1 4 2 6 0 1 3 1 0 5 0V0H0Z"
          fill="#1c1917"
        ></path>
      </svg>
    </>
  );
}
