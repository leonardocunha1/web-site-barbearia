import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { RegisterAdminUseCase } from '../register-admin';

export function makeRegisterAdminUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository();
  const registerUseCase = new RegisterAdminUseCase(prismaUsersRepository);

  return registerUseCase;
}
