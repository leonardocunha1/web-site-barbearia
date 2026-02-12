import { CouponSortField, CouponSortOrder } from '@/schemas/coupon';
import { Coupon, CouponRedemption, Prisma } from '@prisma/client';

export interface CouponRedemptionData {
  couponId: string;
  userId: string;
  bookingId: string;
  discount: number;
}

export interface CouponFilters {
  code?: string;
  type?: 'PERCENTAGE' | 'FIXED' | 'FREE';
  scope?: 'GLOBAL' | 'SERVICE' | 'PROFESSIONAL';
  active?: boolean;
  startDate?: Date;
  endDate?: Date;
  professionalId?: string;
  serviceId?: string;
}

export interface FindManyParams {
  page: number;
  limit: number;
  sort?: { field: CouponSortField; order: CouponSortOrder }[];
  filters?: CouponFilters;
}

export interface ICouponRepository {
  findByCode(code: string): Promise<
    | (Coupon & {
        redemptions: CouponRedemption[];
      })
    | null
  >;

  delete(id: string): Promise<void>;

  registerRedemption(data: CouponRedemptionData): Promise<void>;

  incrementUses(couponId: string): Promise<void>;

  findById(id: string): Promise<Coupon | null>;

  create(data: Prisma.CouponCreateInput): Promise<Coupon>;

  update(id: string, date: Prisma.CouponUpdateInput): Promise<Coupon>;

  listValidCoupons(
    professionalId: string,
    serviceIds: string[],
    currentDate: Date,
  ): Promise<Coupon[]>;

  findMany(params: FindManyParams): Promise<Coupon[]>;

  count(filters?: CouponFilters): Promise<number>;
}
