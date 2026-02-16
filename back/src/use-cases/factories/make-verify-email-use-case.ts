import { PrismaVerificationTokensRepository } from '@/repositories/prisma/prisma-verification-tokens-repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { VerifyEmailUseCase } from '../auth/verify-email-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeVerifyEmailUseCase() {
  const verificationTokensRepository = new PrismaVerificationTokensRepository();
  const usersRepository = new PrismaUsersRepository();

  const useCase = new VerifyEmailUseCase(verificationTokensRepository, usersRepository);
  return traceUseCase('auth.verify_email', useCase);
}
