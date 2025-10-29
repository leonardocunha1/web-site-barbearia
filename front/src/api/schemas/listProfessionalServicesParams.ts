import type { ListProfessionalServicesSortDirection } from "./listProfessionalServicesSortDirection";

export type ListProfessionalServicesParams = {
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
  sortDirection?: ListProfessionalServicesSortDirection;
  activeOnly?: boolean;
};
