import type { GetCouponById200CouponType } from "./getCouponById200CouponType";
import type { GetCouponById200CouponScope } from "./getCouponById200CouponScope";
import type { GetCouponById200CouponService } from "./getCouponById200CouponService";
import type { GetCouponById200CouponProfessional } from "./getCouponById200CouponProfessional";
import type { GetCouponById200CouponUser } from "./getCouponById200CouponUser";

/**
 * Modelo completo de cupom
 */
export type GetCouponById200Coupon = {
  id: string;
  /** @minLength 3 */
  code: string;
  /** @nullable */
  description: string | null;
  type: GetCouponById200CouponType;
  /** @minimum 0 */
  value: number;
  scope: GetCouponById200CouponScope;
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
  service?: GetCouponById200CouponService;
  /** @nullable */
  professional?: GetCouponById200CouponProfessional;
  /** @nullable */
  user?: GetCouponById200CouponUser;
};
