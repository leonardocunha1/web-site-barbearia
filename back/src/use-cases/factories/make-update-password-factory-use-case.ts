import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { UpdatePasswordUseCase } from '../users/update-password-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeUpdatePasswordUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const updatePasswordUseCase = new UpdatePasswordUseCase(usersRepository);

  return traceUseCase('user.password.update', updatePasswordUseCase);
}
