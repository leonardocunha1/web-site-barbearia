import { usersRepository } from '@/repositories/prisma/instances';
import { UpdatePasswordUseCase } from '../users/update-password-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeUpdatePasswordUseCase() {
  const updatePasswordUseCase = new UpdatePasswordUseCase(usersRepository);

  return traceUseCase('user.password.update', updatePasswordUseCase);
}
