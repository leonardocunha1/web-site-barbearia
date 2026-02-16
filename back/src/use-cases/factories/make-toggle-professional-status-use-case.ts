import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { ToggleProfessionalStatusUseCase } from '../professional/toggle-professional-status-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeToggleProfessionalStatusUseCase() {
  const professionalsRepository = new PrismaProfessionalsRepository();
  const useCase = new ToggleProfessionalStatusUseCase(professionalsRepository);

  return traceUseCase('professional.toggle_status', useCase);
}
