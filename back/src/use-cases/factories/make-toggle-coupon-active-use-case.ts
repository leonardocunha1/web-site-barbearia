import { PrismaCouponRepository } from '@/repositories/prisma/prisma-coupon-repository';
import { ToggleCouponActiveUseCase } from '../coupons/toggle-coupon-active-use-case';

export function makeToggleCouponActiveUseCase() {
  const couponRepository = new PrismaCouponRepository();
  const useCase = new ToggleCouponActiveUseCase(couponRepository);

  return useCase;
}
