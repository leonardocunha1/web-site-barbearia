import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { PrismaVerificationTokensRepository } from '@/repositories/prisma/prisma-verification-tokens-repository';
import { EmailService } from '@/services/email-service';
import { SendVerificationEmailUseCase } from '../auth/send-verification-email-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeSendVerificationEmailUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const verificationTokensRepository = new PrismaVerificationTokensRepository();
  const emailService = new EmailService();

  const useCase = new SendVerificationEmailUseCase(
    usersRepository,
    verificationTokensRepository,
    emailService,
  );

  return traceUseCase('auth.send_verification_email', useCase);
}
