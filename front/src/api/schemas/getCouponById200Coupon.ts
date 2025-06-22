import type { GetCouponById200CouponType } from "./getCouponById200CouponType";
import type { GetCouponById200CouponScope } from "./getCouponById200CouponScope";
import type { GetCouponById200CouponService } from "./getCouponById200CouponService";
import type { GetCouponById200CouponProfessional } from "./getCouponById200CouponProfessional";
import type { GetCouponById200CouponUser } from "./getCouponById200CouponUser";

/**
 * Coupon
 */
export type GetCouponById200Coupon = {
  id: string;
  code: string;
  /** @nullable */
  description: string | null;
  type: GetCouponById200CouponType;
  value: number;
  scope: GetCouponById200CouponScope;
  /** @nullable */
  maxUses: number | null;
  uses: number;
  startDate: string;
  /** @nullable */
  endDate: string | null;
  /** @nullable */
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
