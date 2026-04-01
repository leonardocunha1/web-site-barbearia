import { professionalsRepository, bookingsRepository } from '@/repositories/prisma/instances';
import { GetProfessionalDashboardUseCase } from '../professional/get-profissional-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeProfessionalDashboardUseCase() {
  const useCase = new GetProfessionalDashboardUseCase(professionalsRepository, bookingsRepository);

  return traceUseCase('professional.dashboard', useCase);
}
