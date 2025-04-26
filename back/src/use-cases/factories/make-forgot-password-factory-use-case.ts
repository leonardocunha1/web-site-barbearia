import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { PrismaPasswordResetTokensRepository } from '@/repositories/prisma/prisma-password-reset-tokens-repository';
import { EmailService } from '@/services/email-service';
import { ForgotPasswordUseCase } from '../auth/forgot-password-use-case';

export function makeForgotPasswordUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const passwordResetTokensRepository =
    new PrismaPasswordResetTokensRepository();
  const emailService = new EmailService();

  const useCase = new ForgotPasswordUseCase(
    usersRepository,
    passwordResetTokensRepository,
    emailService,
  );

  return useCase;
}
