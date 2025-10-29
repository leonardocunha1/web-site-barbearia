import type { ListCouponsSortDirection } from "./listCouponsSortDirection";
import type { ListCouponsType } from "./listCouponsType";
import type { ListCouponsScope } from "./listCouponsScope";
import type { ListCouponsSortItem } from "./listCouponsSortItem";

export type ListCouponsParams = {
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
  sortDirection?: ListCouponsSortDirection;
  code?: string;
  type?: ListCouponsType;
  scope?: ListCouponsScope;
  active?: boolean;
  startDate?: string;
  endDate?: string;
  sort?: ListCouponsSortItem[];
  professionalId?: string;
  serviceId?: string;
};
