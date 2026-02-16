import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { AnonymizeUserUseCase } from '../users/anonymize-user-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeAnonymizeUserUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new AnonymizeUserUseCase(usersRepository);

  return traceUseCase('user.anonymize', useCase);
}
