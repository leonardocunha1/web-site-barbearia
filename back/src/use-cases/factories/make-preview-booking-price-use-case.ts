import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { PrismaServiceProfessionalRepository } from '@/repositories/prisma/prisma-service-professional-repository';
import { PrismaUserBonusRepository } from '@/repositories/prisma/prisma-user-bonus-repository';
import { PrismaCouponRepository } from '@/repositories/prisma/prisma-coupon-repository';
import { PreviewBookingPriceUseCase } from '@/use-cases/bookings/preview-booking-price-use-case';

export function makePreviewBookingPriceUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const professionalsRepository = new PrismaProfessionalsRepository();
  const serviceProfessionalRepository = new PrismaServiceProfessionalRepository();
  const userBonusRepository = new PrismaUserBonusRepository();
  const couponRepository = new PrismaCouponRepository();

  return new PreviewBookingPriceUseCase(
    usersRepository,
    professionalsRepository,
    serviceProfessionalRepository,
    userBonusRepository,
    couponRepository,
  );
}
