import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { AnonymizeUserUseCase } from '../users/anonymize-user';

export function makeAnonymizeUserUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new AnonymizeUserUseCase(usersRepository);

  return useCase;
}
