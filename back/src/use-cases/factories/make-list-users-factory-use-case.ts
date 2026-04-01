import { usersRepository } from '@/repositories/prisma/instances';
import { ListUsersUseCase } from '../users/list-users-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeListUsersUseCase() {
  const useCase = new ListUsersUseCase(usersRepository);

  return traceUseCase('user.list', useCase);
}
