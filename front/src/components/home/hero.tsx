import { ShinyButton } from "@/components/magicui/shiny-button";
import { WordRotate } from "@/components/magicui/word-rotate";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="grid min-h-[calc(100vh-104px)] md:grid-cols-2 md:items-center md:gap-12">
      {/* Texto */}
      <div className="order-2 flex flex-col items-center space-y-6 text-center md:order-1 md:items-start md:text-start">
        {/* Botão com ordem mobile antes e desktop depois */}
        <div className="order-1 flex justify-center md:order-5 md:mt-6 md:justify-start">
          <Link href="/services">
            <ShinyButton className="border-stone-900 text-lg font-normal">
              Agende seu horário
            </ShinyButton>
          </Link>
        </div>

        {/* Demais conteúdos */}
        <h1 className="text-gourmet-700 text-md order-2 font-medium tracking-widest uppercase">
          El Bigodón Barber Shop
        </h1>

        <h3 className="order-3 font-serif text-3xl leading-tight font-semibold text-stone-900 md:text-5xl lg:text-6xl">
          Onde o estilo é clássico, e o{" "}
          <WordRotate
            className="text-gourmet-700"
            words={["bigode", "cabelo"]}
            duration={5000}
          />{" "}
          <span className="inline lg:block">é sagrado</span>
        </h3>

        <p className="order-4 max-w-md text-base text-stone-600">
          Esqueça cortes apressados e barbeiros distraídos. Aqui a conversa é
          boa, o café é forte, e o cabelo sai no ponto. Seja bem-vindo ao templo
          do bom gosto masculino.
        </p>
      </div>

      {/* Imagem */}
      <div className="order-1 overflow-hidden">
        <div className="flex h-full w-full items-center justify-center text-sm text-stone-500">
          <Image
            src={"/hero-sem-bg.png"}
            width={1024}
            height={1024}
            alt="Image Hero"
            className="w-full max-w-[350px] md:max-w-[500px]"
          />
        </div>
      </div>
    </div>
  );
}
