import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { UpdateUserProfileUseCase } from '../users/update-user-profile-use-case';

export function makeUpdateUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new UpdateUserProfileUseCase(usersRepository);

  return useCase;
}
