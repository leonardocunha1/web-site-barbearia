import type { GetCouponById200CouponType } from "./getCouponById200CouponType";
import type { GetCouponById200CouponScope } from "./getCouponById200CouponScope";
import type { GetCouponById200CouponExpirationType } from "./getCouponById200CouponExpirationType";
import type { GetCouponById200CouponStartDate } from "./getCouponById200CouponStartDate";
import type { GetCouponById200CouponEndDate } from "./getCouponById200CouponEndDate";
import type { GetCouponById200CouponCreatedAt } from "./getCouponById200CouponCreatedAt";
import type { GetCouponById200CouponUpdatedAt } from "./getCouponById200CouponUpdatedAt";
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
  expirationType: GetCouponById200CouponExpirationType;
  /** @nullable */
  maxUses: number | null;
  /** @minimum 0 */
  uses: number;
  startDate: GetCouponById200CouponStartDate;
  /** @nullable */
  endDate: GetCouponById200CouponEndDate;
  /**
   * @minimum 0
   * @nullable
   */
  minBookingValue: number | null;
  active: boolean;
  createdAt: GetCouponById200CouponCreatedAt;
  updatedAt: GetCouponById200CouponUpdatedAt;
  /** @nullable */
  service?: GetCouponById200CouponService;
  /** @nullable */
  professional?: GetCouponById200CouponProfessional;
  /** @nullable */
  user?: GetCouponById200CouponUser;
};
