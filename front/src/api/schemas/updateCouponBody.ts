import type { UpdateCouponBodyType } from "./updateCouponBodyType";
import type { UpdateCouponBodyScope } from "./updateCouponBodyScope";
import type { UpdateCouponBodyExpirationType } from "./updateCouponBodyExpirationType";

/**
 * Dados para atualização de cupom
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
  expirationType?: UpdateCouponBodyExpirationType;
  description?: string;
  /**
   * @minimum 1
   * @nullable
   */
  maxUses?: number | null;
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
