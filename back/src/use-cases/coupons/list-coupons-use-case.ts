import { CouponRepository } from '@/repositories/coupon-repository';
import { validatePagination } from '@/utils/validate-pagination';
import { InvalidPageRangeError } from '../errors/invalid-page-range-error';
import { Coupon } from '@prisma/client';
import { CouponSortField, CouponSortOrder } from '@/schemas/coupon';

interface ListCouponsUseCaseRequest {
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

interface ListCouponsUseCaseResponse {
  coupons: Coupon[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ListCouponsUseCase {
  constructor(private couponRepository: CouponRepository) {}

  async execute({
    page = 1,
    limit = 10,
    sort = [{ field: 'createdAt', order: 'desc' }],
    filters = {},
  }: ListCouponsUseCaseRequest): Promise<ListCouponsUseCaseResponse> {
    validatePagination(page, limit);

    const [coupons, total] = await Promise.all([
      this.couponRepository.findMany({
        page,
        limit,
        sort,
        filters,
      }),
      this.couponRepository.count(filters),
    ]);

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && totalPages > 0) {
      throw new InvalidPageRangeError();
    }

    return {
      coupons,
      total,
      page,
      limit,
      totalPages,
    };
  }
}
