import type { GetCouponsCouponId200CouponType } from "./getCouponsCouponId200CouponType";
import type { GetCouponsCouponId200CouponScope } from "./getCouponsCouponId200CouponScope";
import type { GetCouponsCouponId200CouponService } from "./getCouponsCouponId200CouponService";
import type { GetCouponsCouponId200CouponProfessional } from "./getCouponsCouponId200CouponProfessional";
import type { GetCouponsCouponId200CouponUser } from "./getCouponsCouponId200CouponUser";

export type GetCouponsCouponId200Coupon = {
  id: string;
  code: string;
  /** @nullable */
  description: string | null;
  type: GetCouponsCouponId200CouponType;
  value: number;
  scope: GetCouponsCouponId200CouponScope;
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
  service?: GetCouponsCouponId200CouponService;
  /** @nullable */
  professional?: GetCouponsCouponId200CouponProfessional;
  /** @nullable */
  user?: GetCouponsCouponId200CouponUser;
};
