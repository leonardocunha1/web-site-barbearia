import type { ListServicesSortOrder } from "./listServicesSortOrder";

export type ListServicesParams = {
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
  sortOrder?: ListServicesSortOrder;
  /**
   * @maxLength 100
   */
  nome?: string;
  /**
   * @maxLength 50
   */
  categoria?: string;
  ativo?: boolean;
  professionalId?: string;
};
