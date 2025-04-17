import { UpdateUserProfileUseCase } from '@/use-cases/update-user-profile';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';

export function makeUpdateUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new UpdateUserProfileUseCase(usersRepository);

  return useCase;
}
