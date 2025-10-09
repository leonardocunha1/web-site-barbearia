"use client";

import { motion, easeOut } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFlip, Pagination, Navigation, Autoplay } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/effect-flip";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function Avaliacoes() {
  const reviews = [
    {
      id: 1,
      name: "Lucas Almeida",
      text: "O corte ficou simplesmente impecável! Atendimento de primeira e ambiente top. Recomendo demais!",
      image: "/clientes/cliente-1.jpg",
      rating: 5,
    },
    {
      id: 2,
      name: "Rafael Santos",
      text: "Fui atendido pelo João e saí novo em folha. Barba feita com muito cuidado, voltarei com certeza.",
      image: "/clientes/cliente-2.jpg",
      rating: 5,
    },
    {
      id: 3,
      name: "Pedro Henrique",
      text: "Excelente experiência! O barbeiro entende exatamente o que você quer e ainda dá boas dicas.",
      image: "/clientes/cliente-3.jpg",
      rating: 4,
    },
    {
      id: 4,
      name: "Tiago Silva",
      text: "Ambiente aconchegante e profissionais muito atenciosos. Corte de alto nível!",
      image: "/clientes/cliente-4.jpg",
      rating: 5,
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
      className="py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <motion.div
          className="mb-10 text-center md:mb-16"
          variants={itemVariants}
        >
          <h4 className="text-base font-semibold text-stone-600">
            A Opinião de Quem Confia
          </h4>
          <h2 className="font-calistoga pt-5 text-5xl font-bold text-stone-900 sm:text-6xl">
            Nossos Clientes
            <span className="from-principal-500 to-principal-600 bg-gradient-to-r bg-clip-text pl-2 text-transparent">
              Falam!
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-stone-600">
            Cada cliente sai com um sorriso no rosto e uma história pra contar.
            Veja o que dizem sobre nossos serviços.
          </p>
        </motion.div>

        {/* Swiper */}
        <motion.div variants={itemVariants}>
          <Swiper
            effect="flip"
            grabCursor
            pagination={{ clickable: true }}
            navigation
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            modules={[EffectFlip, Pagination, Navigation, Autoplay]}
            className="mySwiper"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id}>
                <div className="flex flex-col items-center justify-center rounded-2xl bg-stone-100/70 px-6 py-10 shadow-md backdrop-blur-sm sm:px-10">
                  <div className="ring-principal-500/30 relative mb-6 h-20 w-20 overflow-hidden rounded-full ring-4">
                    <Image
                      src={review.image}
                      alt={review.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-center leading-relaxed text-stone-700 italic">
                    “{review.text}”
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span key={i} className="text-lg text-yellow-500">
                        ★
                      </span>
                    ))}
                  </div>
                  <h3 className="mt-3 font-semibold text-stone-900">
                    {review.name}
                  </h3>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </motion.section>
  );
}
