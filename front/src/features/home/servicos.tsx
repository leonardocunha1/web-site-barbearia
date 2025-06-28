import Image from "next/image";
import { cn } from "@/lib/utils";
import H4 from "@/components/ui/h4";
import H2 from "@/components/ui/h2";

export default async function Servicos() {
  const services = [
    {
      id: 1,
      title: "Corte de Tesoura",
      description: "Cortes precisos com técnicas tradicionais de tesoura",
      image: "/cortes/corte-2.jpg",
      position: "object-center",
    },
    {
      id: 2,
      title: "Corte Tradicional",
      description:
        "O tradicional que nunca sai de moda, com acabamento impecável",
      image: "/cortes/corte-1.jpg",
      position: "object-center",
    },
    {
      id: 3,
      title: "Barba Premium",
      description:
        "Tratamento completo com toalha quente e produtos exclusivos",
      image: "/cortes/corte-3.jpg",
      position: "object-top",
    },
    {
      id: 4,
      title: "Degradê Moderno",
      description:
        "Transição suave entre os volumes para um visual contemporâneo",
      image: "/cortes/corte-4.jpg",
      position: "object-center",
    },
    {
      id: 5,
      title: "Corte Infantil",
      description: "Cortes para os Bigodons mais novos, com carinho e atenção",
      image: "/cortes/corte-5.jpg",
      position: "object-center",
    },
  ];

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Cabeçalho */}
        <div className="mb-12 text-center md:mb-16">
          <H4>Nossos Serviços</H4>
          <H2>A Arte da Barbearia</H2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600">
            Cada corte é uma assinatura, cada barba é uma obra-prima. Conheça
            nossos serviços exclusivos.
          </p>
        </div>

        {/* Grid de Serviços */}
        <div className="grid auto-rows-[280px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const isTall = index === 1; // Apenas a segunda imagem ocupa 2 linhas

            return (
              <div
                key={service.id}
                className={cn(
                  "group relative overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-xl",
                  isTall && "sm:row-span-2",
                )}
              >
                <div className="relative h-full w-full">
                  {/* Fundo escurecido e gradiente */}
                  <div className="absolute inset-0 z-10 bg-black/20">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />
                  </div>

                  {/* Imagem com posição personalizada */}
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className={cn(
                      "z-0 object-cover transition-transform duration-500 group-hover:scale-105",
                      service.position || "object-center",
                    )}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {/* Texto */}
                  <div className="text-principal-100 absolute inset-x-0 bottom-0 z-20 p-6">
                    <h3 className="text-principal-400 font-serif text-xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      {service.title}
                    </h3>
                    <p className="mt-1 text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
