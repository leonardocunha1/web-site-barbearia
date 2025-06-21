import type { PutCouponsCouponIdBodyType } from "./putCouponsCouponIdBodyType";
import type { PutCouponsCouponIdBodyScope } from "./putCouponsCouponIdBodyScope";

export type PutCouponsCouponIdBody = {
  /**
   * @minLength 3
   * @maxLength 20
   */
  code?: string;
  type?: PutCouponsCouponIdBodyType;
  /** @minimum 0 */
  value?: number;
  scope?: PutCouponsCouponIdBodyScope;
  description?: string;
  /** @minimum 1 */
  maxUses?: number;
  startDate?: string;
  /** @nullable */
  endDate?: string | null;
  /**
   * @minimum 0
   * @nullable
   */
  minBookingValue?: number | null;
  /** @nullable */
  serviceId?: string | null;
  /** @nullable */
  professionalId?: string | null;
  active?: boolean;
};
