import type { UpdateCoupon200CouponType } from "./updateCoupon200CouponType";
import type { UpdateCoupon200CouponScope } from "./updateCoupon200CouponScope";
import type { UpdateCoupon200CouponService } from "./updateCoupon200CouponService";
import type { UpdateCoupon200CouponProfessional } from "./updateCoupon200CouponProfessional";
import type { UpdateCoupon200CouponUser } from "./updateCoupon200CouponUser";

/**
 * Modelo completo de cupom
 */
export type UpdateCoupon200Coupon = {
  id: string;
  /** @minLength 3 */
  code: string;
  /** @nullable */
  description: string | null;
  type: UpdateCoupon200CouponType;
  /** @minimum 0 */
  value: number;
  scope: UpdateCoupon200CouponScope;
  /** @nullable */
  maxUses: number | null;
  /** @minimum 0 */
  uses: number;
  startDate: string;
  /** @nullable */
  endDate: string | null;
  /**
   * @minimum 0
   * @nullable
   */
  minBookingValue: number | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  /** @nullable */
  service?: UpdateCoupon200CouponService;
  /** @nullable */
  professional?: UpdateCoupon200CouponProfessional;
  /** @nullable */
  user?: UpdateCoupon200CouponUser;
};
