import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { UpdateUserProfileUseCase } from '../users/update-user-profile-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeUpdateUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new UpdateUserProfileUseCase(usersRepository);

  return traceUseCase('user.profile.update', useCase);
}
