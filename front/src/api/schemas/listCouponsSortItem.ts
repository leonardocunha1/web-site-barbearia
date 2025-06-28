import type { ListCouponsSortItemField } from "./listCouponsSortItemField";
import type { ListCouponsSortItemOrder } from "./listCouponsSortItemOrder";

/**
 * Configuração de ordenação para cupons
 */
export type ListCouponsSortItem = {
  /** Campo para ordenação de cupons */
  field: ListCouponsSortItemField;
  /** Ordem de ordenação */
  order: ListCouponsSortItemOrder;
};
