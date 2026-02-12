import type { CreateCouponBodyType } from "./createCouponBodyType";
import type { CreateCouponBodyScope } from "./createCouponBodyScope";

/**
 * Dados para criação de cupom
 */
export type CreateCouponBody = {
  /**
   * @minLength 3
   * @maxLength 50
   */
  code: string;
  type: CreateCouponBodyType;
  /** @minimum 0 */
  value: number;
  scope: CreateCouponBodyScope;
  /** @maxLength 255 */
  description?: string;
  /**
   * @minimum 0
   * @exclusiveMinimum
   */
  maxUses?: number;
  startDate?: string;
  endDate?: string;
  /**
   * @minimum 0
   * @exclusiveMinimum
   */
  minBookingValue?: number;
  serviceId?: string;
  professionalId?: string;
};
