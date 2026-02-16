import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { GetUserProfileUseCase } from '../users/get-user-profile-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeGetUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new GetUserProfileUseCase(usersRepository);

  return traceUseCase('user.profile.get', useCase);
}
