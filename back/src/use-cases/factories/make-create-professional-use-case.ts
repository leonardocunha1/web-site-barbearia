import { professionalsRepository, usersRepository } from '@/repositories/prisma/instances';
import { CreateProfessionalUseCase } from '../professional/create-professional-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeCreateProfessionalUseCase() {
  const useCase = new CreateProfessionalUseCase(professionalsRepository, usersRepository);

  return traceUseCase('professional.create', useCase);
}
