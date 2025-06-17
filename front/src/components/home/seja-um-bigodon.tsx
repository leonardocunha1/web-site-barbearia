"use client";

import React from "react";
import {
  CurrencyDollarSimpleIcon,
  HandshakeIcon,
  ScissorsIcon,
} from "@phosphor-icons/react";
import Image from "next/image";

const offerings = [
  {
    title: "Programa de Fidelidade",
    description:
      "Valorize cada visita. A cada corte ou serviço realizado, você acumula pontos que podem ser trocados por descontos, brindes ou serviços gratuitos. Uma forma especial de agradecer sua preferência.",
    emphasis: "Acumule vantagens.",
    icon: (
      <HandshakeIcon size={32} weight="fill" className="text-principal-100" />
    ),
  },
  {
    title: "Melhores Preços da Cidade",
    description:
      "Qualidade e economia andam juntas por aqui. Oferecemos serviços de alto nível com os preços mais competitivos da região, sem abrir mão da excelência no atendimento.",
    emphasis: "Custo-benefício imbatível.",
    icon: <CurrencyDollarSimpleIcon size={32} className="text-principal-100" />,
  },
  {
    title: "Cortes e Serviços de Qualidade",
    description:
      "Profissionais experientes, equipamentos de primeira e atenção aos detalhes em cada atendimento. Desde o corte até o acabamento, você sai com o visual impecável.",
    emphasis: "Seu estilo em boas mãos.",
    icon: (
      <ScissorsIcon size={32} weight="fill" className="text-principal-100" />
    ),
  },
];

export default function SejaUmBigodon() {
  return (
    <section className="px-4 py-12 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-16 xl:gap-24">
          {/* Seção de título e imagem */}
          <div className="space-y-8 lg:sticky lg:top-8 lg:h-fit">
            <div className="space-y-6">
              <span className="text-sm font-semibold tracking-wider text-amber-600 uppercase">
                Valorize seu estilo & bem-estar
              </span>
              <h2 className="font-serif text-4xl font-bold text-neutral-900 sm:text-5xl">
                Seja um Bigodón
              </h2>
              <p className="max-w-lg text-lg text-neutral-600">
                Três formas de cuidar da sua aparência com serviços pensados
                para o homem moderno.
              </p>
            </div>

            <div className="mt-8 lg:mt-0">
              <Image
                src="/info-img.png"
                alt="Barber pole"
                width={1024}
                height={1536}
                className="a mx-auto w-full max-w-[250px] rounded-xl object-cover lg:max-w-[300px]"
              />
            </div>
          </div>

          {/* Seção de cards com timeline */}
          <div className="relative">
            {/* Linha vertical decorativa */}
            <div className="from-principal-500 via-principal-300 to-principal-500 absolute top-0 bottom-0 left-0 w-0.5 bg-gradient-to-b lg:left-6">
              {/* Marcadores na linha */}
              <div className="bg-principal-600 ring-principal-300 absolute top-0 -left-[5px] h-3 w-3 rounded-full ring-2"></div>
              <div className="bg-principal-600 ring-principal-300 absolute top-1/2 -left-[5px] h-3 w-3 rounded-full ring-2"></div>
              <div className="bg-principal-600 ring-principal-300 absolute bottom-0 -left-[5px] h-3 w-3 rounded-full ring-2"></div>
            </div>

            {/* Cards */}
            <div className="space-y-12 pl-8 lg:pl-14">
              {offerings.map((offering, idx) => (
                <div key={idx} className="group relative">
                  <div className="flex gap-6">
                    <div className="group-hover:bg-principal-600 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-stone-900 p-2 transition-all duration-300 group-hover:shadow-lg">
                      {offering.icon}
                    </div>

                    <div className="flex-1 pb-6">
                      <h3 className="text-xl font-bold text-stone-900 transition-colors duration-300">
                        {offering.title}
                      </h3>
                      <p className="mt-3 text-neutral-700">
                        <span className="text-principal-600 font-semibold">
                          {offering.emphasis}
                        </span>{" "}
                        {offering.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
