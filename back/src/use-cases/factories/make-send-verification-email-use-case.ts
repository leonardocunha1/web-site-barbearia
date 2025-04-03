import { SendVerificationEmailUseCase } from '@/use-cases/send-verification-email';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { PrismaVerificationTokensRepository } from '@/repositories/prisma/prisma-verification-tokens-repository';
import { EmailService } from '@/services/email-service';

export function makeSendVerificationEmailUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const verificationTokensRepository = new PrismaVerificationTokensRepository();
  const emailService = new EmailService();
  
  return new SendVerificationEmailUseCase(
    usersRepository,
    verificationTokensRepository,
    emailService
  );
}