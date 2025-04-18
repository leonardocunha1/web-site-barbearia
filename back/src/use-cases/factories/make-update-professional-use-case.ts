import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { UpdateProfessionalUseCase } from '../professional/update-professional-use-case';

export function makeUpdateProfessionalUseCase() {
  const professionalsRepository = new PrismaProfessionalsRepository();
  const useCase = new UpdateProfessionalUseCase(professionalsRepository);

  return useCase;
}
