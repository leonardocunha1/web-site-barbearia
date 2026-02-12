import type { CreateCoupon201CouponType } from "./createCoupon201CouponType";
import type { CreateCoupon201CouponScope } from "./createCoupon201CouponScope";
import type { CreateCoupon201CouponService } from "./createCoupon201CouponService";
import type { CreateCoupon201CouponProfessional } from "./createCoupon201CouponProfessional";
import type { CreateCoupon201CouponUser } from "./createCoupon201CouponUser";

/**
 * Modelo completo de cupom
 */
export type CreateCoupon201Coupon = {
  id: string;
  /** @minLength 3 */
  code: string;
  /** @nullable */
  description: string | null;
  type: CreateCoupon201CouponType;
  /** @minimum 0 */
  value: number;
  scope: CreateCoupon201CouponScope;
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
  service?: CreateCoupon201CouponService;
  /** @nullable */
  professional?: CreateCoupon201CouponProfessional;
  /** @nullable */
  user?: CreateCoupon201CouponUser;
};
