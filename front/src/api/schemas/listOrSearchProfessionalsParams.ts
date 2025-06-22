import type { ListOrSearchProfessionalsSortOrder } from "./listOrSearchProfessionalsSortOrder";

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
  sortOrder?: ListOrSearchProfessionalsSortOrder;
  /**
   * Search term for professionals
   * @minLength 2
   */
  query: string;
  /**
   * Filter by active status (default: true)
   */
  ativo?: boolean;
};
