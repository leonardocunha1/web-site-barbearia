import { PrismaCouponRepository } from '@/repositories/prisma/prisma-coupon-repository';
import { CreateCouponUseCase } from '../coupons/create-coupon-use-case';
import { PrismaServicesRepository } from '@/repositories/prisma/prisma-services-repository';
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';

export function makeCreateCouponUseCase() {
  const couponRepository = new PrismaCouponRepository();
  const servicesRepository = new PrismaServicesRepository();
  const professionalsRepository = new PrismaProfessionalsRepository();

  return new CreateCouponUseCase(
    couponRepository,
    servicesRepository,
    professionalsRepository,
  );
}
