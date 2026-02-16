import { PrismaCouponRepository } from '@/repositories/prisma/prisma-coupon-repository';
import { CreateCouponUseCase } from '../coupons/create-coupon-use-case';
import { PrismaServicesRepository } from '@/repositories/prisma/prisma-services-repository';
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeCreateCouponUseCase() {
  const couponRepository = new PrismaCouponRepository();
  const servicesRepository = new PrismaServicesRepository();
  const professionalsRepository = new PrismaProfessionalsRepository();

  const useCase = new CreateCouponUseCase(
    couponRepository,
    servicesRepository,
    professionalsRepository,
  );

  return traceUseCase('coupon.create', useCase);
}
