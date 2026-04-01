import { couponRepository, servicesRepository, professionalsRepository } from '@/repositories/prisma/instances';
import { UpdateCouponUseCase } from '../coupons/update-coupon-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeUpdateCouponUseCase() {
  const useCase = new UpdateCouponUseCase(
    couponRepository,
    servicesRepository,
    professionalsRepository,
  );

  return traceUseCase('coupon.update', useCase);
}
