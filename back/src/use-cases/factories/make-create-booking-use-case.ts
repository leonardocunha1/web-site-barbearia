// src/use-cases/factories/make-create-booking-use-case.ts
import { PrismaBookingsRepository } from '@/repositories/prisma/prisma-bookings-repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { PrismaServiceProfessionalRepository } from '@/repositories/prisma/prisma-service-professional-repository';
import { PrismaUserBonusRepository } from '@/repositories/prisma/prisma-user-bonus-repository';
import { PrismaBonusRedemptionRepository } from '@/repositories/prisma/prisma-bonus-redemption-repository'; // Novo
import { CreateBookingUseCase } from '../bookings/create-booking-use-case';

export function makeCreateBookingUseCase() {
  const bookingsRepository = new PrismaBookingsRepository();
  const usersRepository = new PrismaUsersRepository();
  const professionalsRepository = new PrismaProfessionalsRepository();
  const serviceProfessionalRepository =
    new PrismaServiceProfessionalRepository();
  const userBonusRepository = new PrismaUserBonusRepository();
  const bonusRedemptionRepository = new PrismaBonusRedemptionRepository();

  return new CreateBookingUseCase(
    bookingsRepository,
    usersRepository,
    professionalsRepository,
    serviceProfessionalRepository,
    userBonusRepository,
    bonusRedemptionRepository,
  );
}
