import { professionalsRepository, usersRepository } from '@/repositories/prisma/instances';
import { UpdateProfessionalUseCase } from '../professional/update-professional-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeUpdateProfessionalUseCase() {
  const useCase = new UpdateProfessionalUseCase(professionalsRepository, usersRepository);

  return traceUseCase('professional.update', useCase);
}
