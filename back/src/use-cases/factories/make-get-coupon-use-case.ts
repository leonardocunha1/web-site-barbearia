import { PrismaCouponRepository } from '@/repositories/prisma/prisma-coupon-repository';
import { GetCouponUseCase } from '../coupons/get-coupon-use-case';

export function makeGetCouponUseCase() {
  const couponRepository = new PrismaCouponRepository();
  const useCase = new GetCouponUseCase(couponRepository);

  return useCase;
}
