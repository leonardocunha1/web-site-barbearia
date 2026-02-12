export type Service = {
  id: string;
  nome: string;
  descricao?: string;
  categoria?: "Cabelo" | "Barba" | "Cabelo + Barba";
  ativo: "Ativo" | "Inativo";
};
