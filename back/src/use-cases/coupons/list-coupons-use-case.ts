import { ICouponRepository } from '@/repositories/coupon-repository';
import { validatePagination } from '@/utils/validate-pagination';
import { InvalidPageRangeError } from '../errors/invalid-page-range-error';
import {
  ListCouponsUseCaseRequest,
  ListCouponsUseCaseResponse,
} from './types';

export class ListCouponsUseCase {
  constructor(private couponRepository: ICouponRepository) {}

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

