import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { UpdatePasswordUseCase } from '../update-password';

export function makeUpdatePasswordUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const updatePasswordUseCase = new UpdatePasswordUseCase(usersRepository);

  return updatePasswordUseCase;
}
