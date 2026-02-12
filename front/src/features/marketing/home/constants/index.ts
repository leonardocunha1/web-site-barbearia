/**
 * Home feature constants
 */

import type { ServiceCard } from "../types";

export const SERVICES: ServiceCard[] = [
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
    description: "Tratamento completo com toalha quente e produtos exclusivos",
    image: "/cortes/corte-1.jpg",
    position: "object-center",
    icon: "🧴",
  },
  {
    id: 4,
    title: "Hidratação e Tratamento",
    description: "Produtos de alta qualidade para um cabelo sempre saudável",
    image: "/cortes/imagem-3.jpg",
    position: "object-center",
    icon: "💧",
  },
  {
    id: 5,
    title: "Pigmentação",
    description:
      "Cor e pigmentação da mais alta qualidade com profissionais experientes",
    image: "/cortes/corte-2.jpg",
    position: "object-center",
    icon: "🎨",
  },
];

export const HERO_CONTENT = {
  title: "Bem-vindo ao Mundo da Barbearia Profissional",
  subtitle: "Transforme seu visual com os nossos serviços exclusivos",
  cta: {
    text: "Agendar Agora",
    href: "#agendamento",
  },
};

export const TESTIMONIALS = [
  {
    id: 1,
    name: "João Silva",
    role: "Cliente Premium",
    content: "Melhor barbearia que já experimenti. Profissionais incríveis!",
    rating: 5,
  },
  {
    id: 2,
    name: "Carlos Oliveira",
    role: "Cliente Leal",
    content: "Atendimento excelente e produtos de primeira qualidade.",
    rating: 5,
  },
  {
    id: 3,
    name: "Miguel Santos",
    role: "Cliente Novo",
    content: "Recomendo muito! Experiência inesquecível.",
    rating: 5,
  },
];

export const MARQUEE_ITEMS = [
  "Premium Quality",
  "Expert Service",
  "Modern Style",
  "Professional Care",
  "Best Price",
];
