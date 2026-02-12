import { ICouponRepository } from '@/repositories/coupon-repository';
import { CouponNotFoundError } from '../errors/coupon-not-found-error';
import { GetCouponRequest, GetCouponResponse } from './types';

export class GetCouponUseCase {
  constructor(private couponRepository: ICouponRepository) {}

  async execute({ couponId }: GetCouponRequest): Promise<GetCouponResponse> {
    const coupon = await this.couponRepository.findById(couponId);

    if (!coupon) {
      throw new CouponNotFoundError();
    }

    return {
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        scope: coupon.scope,
        description: coupon.description,
        maxUses: coupon.maxUses,
        uses: coupon.uses,
        startDate: coupon.startDate,
        endDate: coupon.endDate,
        minBookingValue: coupon.minBookingValue,
        active: coupon.active,
        serviceId: coupon.serviceId,
        professionalId: coupon.professionalId,
        createdAt: coupon.createdAt,
        updatedAt: coupon.updatedAt,
      },
    };
  }
}
