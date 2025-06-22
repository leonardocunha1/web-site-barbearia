import type { UpdateCouponBodyType } from "./updateCouponBodyType";
import type { UpdateCouponBodyScope } from "./updateCouponBodyScope";

/**
 * UpdateCouponBody
 */
export type UpdateCouponBody = {
  /**
   * @minLength 3
   * @maxLength 20
   */
  code?: string;
  type?: UpdateCouponBodyType;
  /** @minimum 0 */
  value?: number;
  scope?: UpdateCouponBodyScope;
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
