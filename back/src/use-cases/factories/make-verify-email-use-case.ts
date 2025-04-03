import { VerifyEmailUseCase } from '@/use-cases/verify-email';
import { PrismaVerificationTokensRepository } from '@/repositories/prisma/prisma-verification-tokens-repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';

export function makeVerifyEmailUseCase() {
  const verificationTokensRepository = new PrismaVerificationTokensRepository();
  const usersRepository = new PrismaUsersRepository();
  
  return new VerifyEmailUseCase(verificationTokensRepository, usersRepository);
}