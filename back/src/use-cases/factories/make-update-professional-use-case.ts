import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { UpdateProfessionalUseCase } from '../professional/update-professional-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeUpdateProfessionalUseCase() {
  const professionalsRepository = new PrismaProfessionalsRepository();
  const usersRepository = new PrismaUsersRepository();
  const useCase = new UpdateProfessionalUseCase(professionalsRepository, usersRepository);

  return traceUseCase('professional.update', useCase);
}
