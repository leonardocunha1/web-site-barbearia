import type { GetCouponsType } from "./getCouponsType";
import type { GetCouponsScope } from "./getCouponsScope";
import type { GetCouponsSortItem } from "./getCouponsSortItem";

export type GetCouponsParams = {
  /**
   * @minimum 0
   * @exclusiveMinimum
   */
  page?: number;
  /**
   * @minimum 0
   * @maximum 100
   * @exclusiveMinimum
   */
  limit?: number;
  code?: string;
  type?: GetCouponsType;
  scope?: GetCouponsScope;
  active?: boolean;
  startDate?: string;
  endDate?: string;
  sort?: GetCouponsSortItem[];
  professionalId?: string;
  serviceId?: string;
};
