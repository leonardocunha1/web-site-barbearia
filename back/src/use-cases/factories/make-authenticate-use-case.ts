import { usersRepository, professionalsRepository } from '@/repositories/prisma/instances';
import { AuthenticateUseCase } from '../auth/authenticate-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeAuthenticateUseCase() {
  const authenticateUseCase = new AuthenticateUseCase(
    usersRepository,
    professionalsRepository,
  );

  return traceUseCase('auth.authenticate', authenticateUseCase);
}
