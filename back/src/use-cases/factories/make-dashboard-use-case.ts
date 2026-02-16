import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { PrismaBookingsRepository } from '@/repositories/prisma/prisma-bookings-repository';
import { GetProfessionalDashboardUseCase } from '../professional/get-profissional-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeProfessionalDashboardUseCase() {
  const professionalsRepository = new PrismaProfessionalsRepository();
  const bookingsRepository = new PrismaBookingsRepository();

  const useCase = new GetProfessionalDashboardUseCase(professionalsRepository, bookingsRepository);

  return traceUseCase('professional.dashboard', useCase);
}
