import { usersRepository } from '@/repositories/prisma/instances';
import { AnonymizeUserUseCase } from '../users/anonymize-user-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeAnonymizeUserUseCase() {
  const useCase = new AnonymizeUserUseCase(usersRepository);

  return traceUseCase('user.anonymize', useCase);
}
