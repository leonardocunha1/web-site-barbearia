import { usersRepository, passwordResetTokensRepository } from '@/repositories/prisma/instances';
import { EmailService } from '@/services/email-service';
import { ForgotPasswordUseCase } from '../auth/forgot-password-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeForgotPasswordUseCase() {
  const emailService = new EmailService();

  const useCase = new ForgotPasswordUseCase(
    usersRepository,
    passwordResetTokensRepository,
    emailService,
  );

  return traceUseCase('auth.forgot_password', useCase);
}
