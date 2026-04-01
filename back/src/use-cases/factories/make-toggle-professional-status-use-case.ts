import { professionalsRepository } from '@/repositories/prisma/instances';
import { ToggleProfessionalStatusUseCase } from '../professional/toggle-professional-status-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeToggleProfessionalStatusUseCase() {
  const useCase = new ToggleProfessionalStatusUseCase(professionalsRepository);

  return traceUseCase('professional.toggle_status', useCase);
}
