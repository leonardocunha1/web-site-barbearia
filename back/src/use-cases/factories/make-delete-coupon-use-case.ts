import { PrismaCouponRepository } from '@/repositories/prisma/prisma-coupon-repository';
import { DeleteCouponUseCase } from '../coupons/delete-coupon-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeDeleteCouponUseCase() {
  const couponRepository = new PrismaCouponRepository();
  const useCase = new DeleteCouponUseCase(couponRepository);

  return traceUseCase('coupon.delete', useCase);
}
