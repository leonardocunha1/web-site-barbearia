import type { ListCouponsSortItemField } from "./listCouponsSortItemField";
import type { ListCouponsSortItemOrder } from "./listCouponsSortItemOrder";

/**
 * CouponSort
 */
export type ListCouponsSortItem = {
  /** CouponSortField */
  field: ListCouponsSortItemField;
  /** CouponSortOrder */
  order: ListCouponsSortItemOrder;
};
