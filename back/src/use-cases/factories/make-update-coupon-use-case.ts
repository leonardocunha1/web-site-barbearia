import { PrismaCouponRepository } from '@/repositories/prisma/prisma-coupon-repository';
import { PrismaServicesRepository } from '@/repositories/prisma/prisma-services-repository';
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { UpdateCouponUseCase } from '../coupons/update-coupon-use-case';

export function makeUpdateCouponUseCase() {
  const couponRepository = new PrismaCouponRepository();
  const servicesRepository = new PrismaServicesRepository();
  const professionalsRepository = new PrismaProfessionalsRepository();
  const useCase = new UpdateCouponUseCase(
    couponRepository,
    servicesRepository,
    professionalsRepository,
  );

  return useCase;
}
