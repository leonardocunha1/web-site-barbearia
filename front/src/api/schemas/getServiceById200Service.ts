import type { GetServiceById200ServiceProfissionaisItem } from "./getServiceById200ServiceProfissionaisItem";

export type GetServiceById200Service = {
  id: string;
  nome: string;
  descricao?: string;
  categoria?: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
  profissionais: GetServiceById200ServiceProfissionaisItem[];
};
