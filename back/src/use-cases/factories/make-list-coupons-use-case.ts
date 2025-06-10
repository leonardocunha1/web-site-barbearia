import { PrismaCouponRepository } from '@/repositories/prisma/prisma-coupon-repository';
import { ListCouponsUseCase } from '../coupons/list-coupons-use-case';

export function makeListCouponsUseCase() {
  const couponRepository = new PrismaCouponRepository();
  const useCase = new ListCouponsUseCase(couponRepository);

  return useCase;
}
