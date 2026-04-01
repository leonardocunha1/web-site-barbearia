import { couponRepository } from '@/repositories/prisma/instances';
import { DeleteCouponUseCase } from '../coupons/delete-coupon-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeDeleteCouponUseCase() {
  const useCase = new DeleteCouponUseCase(couponRepository);

  return traceUseCase('coupon.delete', useCase);
}
