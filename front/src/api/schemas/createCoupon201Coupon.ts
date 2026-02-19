import type { CreateCoupon201CouponType } from "./createCoupon201CouponType";
import type { CreateCoupon201CouponScope } from "./createCoupon201CouponScope";
import type { CreateCoupon201CouponExpirationType } from "./createCoupon201CouponExpirationType";
import type { CreateCoupon201CouponStartDate } from "./createCoupon201CouponStartDate";
import type { CreateCoupon201CouponEndDate } from "./createCoupon201CouponEndDate";
import type { CreateCoupon201CouponCreatedAt } from "./createCoupon201CouponCreatedAt";
import type { CreateCoupon201CouponUpdatedAt } from "./createCoupon201CouponUpdatedAt";
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
  expirationType: CreateCoupon201CouponExpirationType;
  /** @nullable */
  maxUses: number | null;
  /** @minimum 0 */
  uses: number;
  startDate: CreateCoupon201CouponStartDate;
  /** @nullable */
  endDate: CreateCoupon201CouponEndDate;
  /**
   * @minimum 0
   * @nullable
   */
  minBookingValue: number | null;
  active: boolean;
  createdAt: CreateCoupon201CouponCreatedAt;
  updatedAt: CreateCoupon201CouponUpdatedAt;
  /** @nullable */
  service?: CreateCoupon201CouponService;
  /** @nullable */
  professional?: CreateCoupon201CouponProfessional;
  /** @nullable */
  user?: CreateCoupon201CouponUser;
};
