import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { PrismaBookingsRepository } from '@/repositories/prisma/prisma-bookings-repository';
import { GetProfessionalDashboardUseCase } from '../professional/get-profissional-use-case';

export function makeProfessionalDashboardUseCase() {
  const professionalsRepository = new PrismaProfessionalsRepository();
  const bookingsRepository = new PrismaBookingsRepository();

  return new GetProfessionalDashboardUseCase(professionalsRepository, bookingsRepository);
}
