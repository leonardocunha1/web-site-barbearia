import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { ListUsersUseCase } from '../users/list-users-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeListUsersUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new ListUsersUseCase(usersRepository);

  return traceUseCase('user.list', useCase);
}
