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
   * Campo para ordenação (opcional)
   */
  sortBy?: string;
  /**
   * Direção da ordenação: asc (crescente) ou desc (decrescente)
   */
  sortDirection?: ListOrSearchProfessionalsSortDirection;
  /**
   * Termo de busca para profissionais
   * @minLength 2
   */
  search?: string;
  /**
   * Filtrar por status ativo ou inativo
   */
  status?: ListOrSearchProfessionalsStatus;
};
