import { couponRepository } from '@/repositories/prisma/instances';
import { GetCouponUseCase } from '../coupons/get-coupon-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeGetCouponUseCase() {
  const useCase = new GetCouponUseCase(couponRepository);

  return traceUseCase('coupon.get', useCase);
}
