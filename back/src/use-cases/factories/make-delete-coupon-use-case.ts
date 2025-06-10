import { PrismaCouponRepository } from '@/repositories/prisma/prisma-coupon-repository';
import { DeleteCouponUseCase } from '../coupons/delete-coupon-use-case';

export function makeDeleteCouponUseCase() {
  const couponRepository = new PrismaCouponRepository();
  const useCase = new DeleteCouponUseCase(couponRepository);

  return useCase;
}
