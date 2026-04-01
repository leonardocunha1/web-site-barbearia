import { usersRepository } from '@/repositories/prisma/instances';
import { UpdateUserProfileUseCase } from '../users/update-user-profile-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeUpdateUserProfileUseCase() {
  const useCase = new UpdateUserProfileUseCase(usersRepository);

  return traceUseCase('user.profile.update', useCase);
}
