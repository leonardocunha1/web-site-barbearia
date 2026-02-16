import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { AuthenticateUseCase } from '../auth/authenticate-use-case';
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeAuthenticateUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository();
  const prismaProfessionalsRepository = new PrismaProfessionalsRepository();
  const authenticateUseCase = new AuthenticateUseCase(
    prismaUsersRepository,
    prismaProfessionalsRepository,
  );

  return traceUseCase('auth.authenticate', authenticateUseCase);
}
