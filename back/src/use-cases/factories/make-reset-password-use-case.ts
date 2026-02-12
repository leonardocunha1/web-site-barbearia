import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { PrismaPasswordResetTokensRepository } from '@/repositories/prisma/prisma-password-reset-tokens-repository';
import { ResetPasswordUseCase } from '../auth/reset-password-use-case';

export function makeResetPasswordUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const passwordResetTokensRepository = new PrismaPasswordResetTokensRepository();

  const useCase = new ResetPasswordUseCase(usersRepository, passwordResetTokensRepository);

  return useCase;
}
