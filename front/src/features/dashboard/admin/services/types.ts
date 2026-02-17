export type Service = {
  id: string;
  nome: string;
  descricao?: string;
  categoria?: string;
  tipo: "CORTE" | "BARBA" | "SOBRANCELHA" | "ESTETICA";
  ativo: "Ativo" | "Inativo";
};
