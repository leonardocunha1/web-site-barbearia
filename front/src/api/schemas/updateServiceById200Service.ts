export type UpdateServiceById200Service = {
  id: string;
  nome: string;
  /** @nullable */
  descricao: string | null;
  /** @nullable */
  categoria: string | null;
  ativo: boolean;
  /** @nullable */
  preco: number | null;
  /** @nullable */
  duracao: number | null;
};
