import { ShinyButton } from "@/components/magicui/shiny-button";
import { WordRotate } from "@/components/magicui/word-rotate";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="min-h-[calc(100vh-104px)] w-full px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid min-h-[calc(100vh-104px-96px)] gap-8 md:grid-cols-2 md:items-center lg:gap-12">
          {/* Conteúdo de Texto */}
          <div className="flex flex-col items-center space-y-6 text-center md:items-start md:space-y-8 md:text-start">
            {/* Título pequeno */}
            <h1 className="text-sm font-medium tracking-widest text-stone-700 uppercase md:text-base">
              El Bigodón Barber Shop
            </h1>

            {/* Título principal */}
            <h2 className="font-serif text-3xl leading-tight font-semibold text-stone-900 md:text-4xl lg:text-5xl xl:text-6xl">
              Onde o estilo é clássico, e o{" "}
              <WordRotate
                words={["bigode", "cabelo"]}
                duration={5000}
                className="text-principal-600"
              />{" "}
              <span className="inline lg:block">é sagrado</span>
            </h2>

            {/* Descrição */}
            <p className="max-w-md text-base text-stone-600 md:text-lg lg:max-w-lg">
              Esqueça cortes apressados e barbeiros distraídos. Aqui a conversa
              é boa, o café é forte, e o cabelo sai no ponto. Seja bem-vindo ao
              templo do bom gosto masculino.
            </p>

            {/* Botão CTA */}
            <div className="pt-2">
              <Link href="/services">
                <ShinyButton className="border-stone-900 px-8 py-3 text-lg font-medium">
                  Agende seu horário
                </ShinyButton>
              </Link>
            </div>
          </div>

          {/* Imagem */}
          <div className="flex items-center justify-center">
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
          </div>
        </div>
      </div>
    </section>
  );
}
