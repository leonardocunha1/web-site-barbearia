import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { CreateProfessionalUseCase } from '../professional/create-professional-use-case';

export function makeCreateProfessionalUseCase() {
  const professionalsRepository = new PrismaProfessionalsRepository();
  const usersRepository = new PrismaUsersRepository();

  const useCase = new CreateProfessionalUseCase(professionalsRepository, usersRepository);

  return useCase;
}
