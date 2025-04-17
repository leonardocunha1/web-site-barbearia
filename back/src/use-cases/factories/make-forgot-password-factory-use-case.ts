import { ForgotPasswordUseCase } from '@/use-cases/forgot-password-use-case';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { PrismaPasswordResetTokensRepository } from '@/repositories/prisma/prisma-password-reset-tokens-repository';
import { EmailService } from '@/services/email-service';

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
