import { usersRepository } from '@/repositories/prisma/instances';
import { GetUserProfileUseCase } from '../users/get-user-profile-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeGetUserProfileUseCase() {
  const useCase = new GetUserProfileUseCase(usersRepository);

  return traceUseCase('user.profile.get', useCase);
}
