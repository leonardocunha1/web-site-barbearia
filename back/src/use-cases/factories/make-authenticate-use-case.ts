import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { AuthenticateUseCase } from '../auth/authenticate-use-case';
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';

export function makeAuthenticateUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository();
  const prismaProfessionalsRepository = new PrismaProfessionalsRepository();
  const authenticateUseCase = new AuthenticateUseCase(
    prismaUsersRepository,
    prismaProfessionalsRepository
  );

  return authenticateUseCase;
}
