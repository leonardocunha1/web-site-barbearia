// src/use-cases/factories/make-register-user-use-case.ts
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { makeSendVerificationEmailUseCase } from './make-send-verification-email-use-case';
import { RegisterUserUseCase } from '../register-use-case';

export function makeRegisterUserUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const professionalsRepository = new PrismaProfessionalsRepository();
  const sendVerificationEmailUseCase = makeSendVerificationEmailUseCase();

  const registerUserUseCase = new RegisterUserUseCase(
    usersRepository,
    professionalsRepository,
    (email) => sendVerificationEmailUseCase.execute({ email }),
  );

  return registerUserUseCase;
}
