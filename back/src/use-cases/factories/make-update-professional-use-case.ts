import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { UpdateProfessionalUseCase } from '../professional/update-professional-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeUpdateProfessionalUseCase() {
  const professionalsRepository = new PrismaProfessionalsRepository();
  const useCase = new UpdateProfessionalUseCase(professionalsRepository);

  return traceUseCase('professional.update', useCase);
}
