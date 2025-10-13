"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion, easeOut } from "framer-motion";

export default function Servicos() {
  const services = [
    {
      id: 1,
      title: "Corte de Tesoura",
      description: "Cortes precisos com técnicas tradicionais de tesoura",
      image: "/cortes/imagem-3.jpg",
      position: "object-center",
      icon: "✂️",
    },
    {
      id: 2,
      title: "Corte Tradicional",
      description:
        "O tradicional que nunca sai de moda, com acabamento impecável",
      image: "/cortes/corte-2.jpg",
      position: "object-center",
      icon: "💈",
    },
    {
      id: 3,
      title: "Barba Premium",
      description:
        "Tratamento completo com toalha quente e produtos exclusivos",
      image: "/cortes/corte-1.jpg",
      position: "object-center",
      icon: "🧴",
    },
    {
      id: 5,
      title: "Corte Infantil",
      description: "Cortes para os Bigodons mais novos, com carinho e atenção",
      image: "/cortes/corte-5.jpg",
      position: "object-center",
      icon: "🧒",
    },
  ];

  // Variants para animação
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: easeOut } },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
      className="pt-16 pb-16 sm:pt-0 sm:pb-0"
    >
      <div className="mx-auto max-w-7xl">
        {/* Cabeçalho */}
        <motion.div
          className="mb-8 text-center md:mb-16"
          variants={itemVariants}
        >
          <h4 className="text-base font-semibold text-stone-600 uppercase">
            A Arte da Barbearia
          </h4>
          <h2 className="font-calistoga pt-5 text-5xl font-bold text-stone-900 sm:text-6xl">
            Nossos Serviços
            <span className="from-principal-500 to-principal-600 bg-gradient-to-r bg-clip-text pl-2 text-transparent">
              !
            </span>
          </h2>
          <p className="mx-auto mt-4 text-base text-stone-600">
            Cada corte é uma assinatura, cada barba é uma obra-prima. Conheça
            nossos serviços exclusivos.
          </p>
        </motion.div>

        {/* Grid de Serviços */}
        <motion.div
          className="grid auto-rows-[200px] grid-cols-1 sm:grid-cols-3 lg:auto-rows-[220px] lg:grid-cols-4"
          variants={containerVariants}
        >
          {services.map((service, index) => {
            const layoutClasses = cn(
              "group relative overflow-hidden bg-stone-900",
              {
                "sm:col-span-2 sm:row-span-2": index === 0,
                "sm:col-start-3 sm:row-span-1": index === 1,
                "sm:col-start-3 sm:row-start-2 sm:row-span-1 lg:col-start-3 lg:col-span-2":
                  index === 2,
                "sm:hidden lg:block lg:col-span-1": index === 3,
              },
            );

            return (
              <motion.div
                key={service.id}
                className={layoutClasses}
                variants={itemVariants}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className={cn(
                      "z-0 object-cover transition-transform duration-500 ease-out",
                      service.position || "object-center",
                    )}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Lista de serviços */}
        <motion.div
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3"
          variants={containerVariants}
        >
          {services.slice(0, 3).map((service) => (
            <motion.div
              key={service.id}
              className="group cursor-pointer rounded-xl bg-white/20 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/50 hover:shadow-lg"
              variants={itemVariants}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-principal-600 text-2xl">
                  {service.icon}
                </span>
                <h3 className="font-calistoga mb-1 text-xl text-stone-900">
                  {service.title}
                </h3>
                <p className="text-center text-sm leading-relaxed text-stone-600 transition-colors duration-300 group-hover:text-stone-800">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
