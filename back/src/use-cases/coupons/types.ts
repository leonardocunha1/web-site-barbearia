import { Coupon } from '@prisma/client';
import {
  CouponSortField,
  CouponSortOrder,
  CreateCouponBody,
  UpdateCouponBody,
} from '@/schemas/coupon';

/**
 * Use-case types for coupons.
 * These types transform HTTP schema types (with string dates) to internal types (with Date objects).
 * This separation allows the controller layer to handle validation and type conversion,
 * while keeping business logic pure with properly typed objects.
 */

/**
 * Create request transforms schema's string dates to Date objects
 */
export interface CreateCouponRequest
  extends Omit<CreateCouponBody, 'startDate' | 'endDate'> {
  startDate?: Date;
  endDate?: Date | null;
}

export interface CreateCouponResponse {
  coupon: Coupon;
}

/**
 * Update request transforms schema's string dates to Date objects
 */
export interface UpdateCouponRequest {
  couponId: string; date: Omit<UpdateCouponBody, 'startDate' | 'endDate'> & {
    startDate?: Date;
    endDate?: Date | null;
  };
}

export interface UpdateCouponResponse {
  coupon: Coupon;
}

export interface GetCouponRequest {
  couponId: string;
}

export interface GetCouponResponse {
  coupon: Omit<Coupon, 'userId'>;
}

export interface ListCouponsUseCaseRequest {
  page?: number;
  limit?: number;
  sort?: {
    field: CouponSortField;
    order: CouponSortOrder;
  }[];
  filters?: {
    code?: string;
    type?: 'PERCENTAGE' | 'FIXED' | 'FREE';
    scope?: 'GLOBAL' | 'SERVICE' | 'PROFESSIONAL';
    active?: boolean;
    startDate?: Date;
    endDate?: Date;
    professionalId?: string;
    serviceId?: string;
  };
}

/**
 * Paginated response following flat format pattern
 * Standard format: { [itemsKey]: T[], total, page, limit, totalPages }
 */
export interface ListCouponsUseCaseResponse {
  coupons: Coupon[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
