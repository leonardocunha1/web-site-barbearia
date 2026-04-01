import { usersRepository, passwordResetTokensRepository } from '@/repositories/prisma/instances';
import { ResetPasswordUseCase } from '../auth/reset-password-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeResetPasswordUseCase() {
  const useCase = new ResetPasswordUseCase(usersRepository, passwordResetTokensRepository);

  return traceUseCase('auth.reset_password', useCase);
}
