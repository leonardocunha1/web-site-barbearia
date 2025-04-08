// src/use-cases/factories/make-create-booking-use-case.ts
import { PrismaBookingsRepository } from '@/repositories/prisma/prisma-bookings-repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { PrismaServicesRepository } from '@/repositories/prisma/prisma-services-repository';
import { CreateBookingUseCase } from '../create-booking-use-case';

export function makeCreateBookingUseCase() {
  const bookingsRepository = new PrismaBookingsRepository();
  const usersRepository = new PrismaUsersRepository();
  const professionalsRepository = new PrismaProfessionalsRepository();
  const servicesRepository = new PrismaServicesRepository();

  const createBookingUseCase = new CreateBookingUseCase(
    bookingsRepository,
    usersRepository,
    professionalsRepository,
    servicesRepository,
  );

  return createBookingUseCase;
}
