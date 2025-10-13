"use client";

import { motion, easeOut } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { Smile, Laugh, Meh, Frown } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";

export default function Avaliacoes() {
  const reviews = [
    {
      id: 1,
      name: "Lucas Almeida",
      text: "O corte ficou simplesmente impecável! Atendimento de primeira e ambiente top. Recomendo demais!",
      rating: 5,
    },
    {
      id: 2,
      name: "Rafael Santos",
      text: "Fui atendido pelo João e saí novo em folha. Barba feita com muito cuidado, voltarei com certeza.",
      rating: 5,
    },
    {
      id: 3,
      name: "Pedro Henrique",
      text: "Excelente experiência! O barbeiro entende exatamente o que você quer e ainda dá boas dicas.",
      rating: 4,
    },
    {
      id: 4,
      name: "Tiago Silva",
      text: "Ambiente aconchegante e profissionais muito atenciosos. Corte de alto nível!",
      rating: 3,
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
      className="pt-16 pb-16 sm:pt-0"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <motion.div className="text-center" variants={itemVariants}>
          <h4 className="text-base font-semibold tracking-wider text-stone-600 uppercase">
            A Opinião de Quem Confia
          </h4>
          <h2 className="font-calistoga pt-5 text-4xl font-bold text-stone-900 sm:text-6xl">
            Nossos Clientes
            <span className="from-principal-500 to-principal-600 bg-gradient-to-r bg-clip-text pl-2 text-transparent">
              Falam!
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-stone-600">
            Cada cliente sai com um sorriso no rosto e uma história pra contar.
            Veja o que dizem sobre nossos serviços.
          </p>
        </motion.div>

        {/* Swiper */}
        <motion.div variants={itemVariants} className="px-2">
          <Swiper
            grabCursor
            pagination={{
              clickable: true,
              bulletClass: "swiper-pagination-bullet bg-stone-300 opacity-50",
              bulletActiveClass:
                "swiper-pagination-bullet-active !bg-principal-500 !opacity-100",
            }}
            autoplay={{
              delay: 5500,
              disableOnInteraction: false,
            }}
            modules={[Pagination, Autoplay]}
            className="relative pb-10"
            style={{ paddingTop: "20px", paddingBottom: "20px" }}
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id}>
                <div className="mx-auto w-full max-w-sm px-4 py-8 sm:max-w-md md:max-w-lg">
                  <div className="relative rounded-2xl bg-white p-8 pt-16 pb-12 shadow-2xl ring-1 shadow-stone-200/60 ring-stone-200/80">
                    {/* Ícone de Aspas */}
                    <div className="absolute -top-6 left-10 -translate-x-1/2">
                      <div className="from-principal-500 to-principal-600 rounded-full bg-gradient-to-r p-4 shadow-lg">
                        <svg
                          className="h-7 w-7 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                        </svg>
                      </div>
                    </div>

                    {/* Ícone baseado no rating */}
                    <div className="mb-4 flex justify-center">
                      {review.rating === 5 && (
                        <Laugh size={36} className="text-principal-500" />
                      )}
                      {review.rating === 4 && (
                        <Smile size={36} className="text-principal-500" />
                      )}
                      {review.rating === 3 && (
                        <Smile size={36} className="text-stone-500" />
                      )}
                      {review.rating === 2 && (
                        <Meh size={36} className="text-stone-400" />
                      )}
                      {review.rating === 1 && (
                        <Frown size={36} className="text-stone-400" />
                      )}
                    </div>

                    {/* Texto */}
                    <p className="mb-6 pt-4 text-center text-sm leading-relaxed text-stone-700 sm:text-base">
                      {review.text}
                    </p>

                    {/* Estrelas */}
                    <div className="mb-4 flex items-center justify-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`text-xl ${
                            i < review.rating
                              ? "text-yellow-400 drop-shadow-sm"
                              : "text-stone-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    {/* Nome */}
                    <div className="text-center">
                      <div className="inline-flex items-center gap-3">
                        <div className="from-principal-500 to-principal-600 h-1 w-8 rounded-full bg-gradient-to-r"></div>
                        <h3 className="text-base font-semibold text-stone-900 sm:text-lg">
                          {review.name}
                        </h3>
                        <div className="from-principal-500 to-principal-600 h-1 w-8 rounded-full bg-gradient-to-r"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </motion.section>
  );
}
