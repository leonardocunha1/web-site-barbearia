import { verificationTokensRepository, usersRepository } from '@/repositories/prisma/instances';
import { VerifyEmailUseCase } from '../auth/verify-email-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeVerifyEmailUseCase() {
  const useCase = new VerifyEmailUseCase(verificationTokensRepository, usersRepository);
  return traceUseCase('auth.verify_email', useCase);
}
