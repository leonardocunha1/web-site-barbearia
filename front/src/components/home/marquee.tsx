import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";

const frases = [
  {
    title: "Bigode em Alta",
    destaque: "@clássico",
    body: "Estilo que nunca sai de moda.",
  },
  {
    title: "Barba bem feita",
    destaque: "@precisão",
    body: "Navalha na medida e respeito ao rosto.",
  },
  {
    title: "Corte na régua",
    destaque: "@detalhe",
    body: "Do degradê ao social, tudo com perfeição.",
  },
  {
    title: "Toalha quente",
    destaque: "@relax",
    body: "Momento de rei, cuidado de mestre.",
  },
  {
    title: "Estilo masculino",
    destaque: "@personalizado",
    body: "Aqui o corte combina com você.",
  },
  {
    title: "O templo do bom gosto",
    destaque: "@ElBigodón",
    body: "Mais que um corte, uma experiência.",
  },
];

const primeiraLinha = frases;
// const primeiraLinha = frases.slice(0, frases.length / 2);
// const segundaLinha = frases.slice(frases.length / 2);

const FraseCard = ({
  title,
  destaque,
  body,
}: {
  title: string;
  destaque: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-stone-900/[.1] bg-stone-900",
        "dark:border-white/[.1] dark:bg-white/[.05] dark:hover:bg-white/[.1]",
      )}
    >
      <div className="flex flex-col gap-1">
        <figcaption className="text-principal-50 text-sm font-semibold dark:text-white">
          {title}
        </figcaption>
        <p className="text-principal-500 text-xs dark:text-white/40">
          {destaque}
        </p>
      </div>
      <blockquote className="text-principal-100 mt-2 text-sm dark:text-white">
        {body}
      </blockquote>
    </figure>
  );
};

export function MarqueeDetails() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-4">
      <Marquee className="mx-auto w-full" pauseOnHover>
        {primeiraLinha.map((frase, i) => (
          <FraseCard key={i} {...frase} />
        ))}
      </Marquee>
      {/* <Marquee reverse className="mx-auto w-full" pauseOnHover>
        {segundaLinha.map((frase, i) => (
          <FraseCard key={i} {...frase} />
        ))}
      </Marquee> */}
      {/* <div className="from-principal-50 pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
      <div className="from-principal-50 pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div> */}
    </div>
  );
}
