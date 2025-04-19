import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { ToggleProfessionalStatusUseCase } from '../professional/toggle-professional-status-use-case';

export function makeToggleProfessionalStatusUseCase() {
  const professionalsRepository = new PrismaProfessionalsRepository();
  const useCase = new ToggleProfessionalStatusUseCase(professionalsRepository);

  return useCase;
}
