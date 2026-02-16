import { PrismaCouponRepository } from '@/repositories/prisma/prisma-coupon-repository';
import { GetCouponUseCase } from '../coupons/get-coupon-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeGetCouponUseCase() {
  const couponRepository = new PrismaCouponRepository();
  const useCase = new GetCouponUseCase(couponRepository);

  return traceUseCase('coupon.get', useCase);
}
