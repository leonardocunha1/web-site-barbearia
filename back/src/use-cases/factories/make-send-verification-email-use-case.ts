import { usersRepository, verificationTokensRepository } from '@/repositories/prisma/instances';
import { EmailService } from '@/services/email-service';
import { SendVerificationEmailUseCase } from '../auth/send-verification-email-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeSendVerificationEmailUseCase() {
  const emailService = new EmailService();

  const useCase = new SendVerificationEmailUseCase(
    usersRepository,
    verificationTokensRepository,
    emailService,
  );

  return traceUseCase('auth.send_verification_email', useCase);
}
