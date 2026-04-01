import { couponRepository, servicesRepository, professionalsRepository } from '@/repositories/prisma/instances';
import { CreateCouponUseCase } from '../coupons/create-coupon-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeCreateCouponUseCase() {
  const useCase = new CreateCouponUseCase(
    couponRepository,
    servicesRepository,
    professionalsRepository,
  );

  return traceUseCase('coupon.create', useCase);
}
