import { PrismaUserBonusRepository } from '@/repositories/prisma/prisma-user-bonus-repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { GetBalanceUseCase } from '../bonus/get-balance-use-case';

export function makeGetBalanceUseCase() {
  const userBonusRepository = new PrismaUserBonusRepository();
  const usersRepository = new PrismaUsersRepository();
  const getBalanceUseCase = new GetBalanceUseCase(
    userBonusRepository,
    usersRepository,
  );

  return getBalanceUseCase;
}
