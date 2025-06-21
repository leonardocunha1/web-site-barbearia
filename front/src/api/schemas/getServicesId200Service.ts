import type { GetServicesId200ServiceProfissionaisItem } from "./getServicesId200ServiceProfissionaisItem";

export type GetServicesId200Service = {
  id: string;
  nome: string;
  descricao?: string;
  categoria?: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
  profissionais: GetServicesId200ServiceProfissionaisItem[];
};
