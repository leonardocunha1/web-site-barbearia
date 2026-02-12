import type { ListOrSearchProfessionalsSortDirection } from "./listOrSearchProfessionalsSortDirection";
import type { ListOrSearchProfessionalsStatus } from "./listOrSearchProfessionalsStatus";

export type ListOrSearchProfessionalsParams = {
  /**
   * Número da página atual (começa em 1)
   * @minimum 0
   * @exclusiveMinimum
   */
  page?: number;
  /**
   * Quantidade de itens por página (máximo 100)
   * @minimum 0
   * @maximum 100
   * @exclusiveMinimum
   */
  limit?: number;
  /**
   * Campo para ordenacao
   */
  sortBy?: string;
  /**
   * Direcao da ordenacao
   */
  sortDirection?: ListOrSearchProfessionalsSortDirection;
  /**
   * Termo de busca para profissionais
   * @minLength 2
   */
  search?: string;
  /**
   * Filtrar por especialidade do profissional
   */
  specialty?: string;
  /**
   * Filtrar por status ativo ou inativo
   */
  status?: ListOrSearchProfessionalsStatus;
};
