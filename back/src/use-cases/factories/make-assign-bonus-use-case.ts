import { PrismaUserBonusRepository } from '@/repositories/prisma/prisma-user-bonus-repository';
import { PrismaBonusTransactionRepository } from '@/repositories/prisma/prisma-bonus-transaction-repository';
import { PrismaBookingsRepository } from '@/repositories/prisma/prisma-bookings-repository';
import { AssignBonusUseCase } from '../bonus/assign-bonus-use-case';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';

export function makeAssignBonusUseCase(): AssignBonusUseCase {
  const userBonusRepository = new PrismaUserBonusRepository();
  const bonusTransactionRepository = new PrismaBonusTransactionRepository();
  const usersRepository = new PrismaUsersRepository();
  const bookingsRepository = new PrismaBookingsRepository();

  const assignBonusUseCase = new AssignBonusUseCase(
    userBonusRepository,
    bonusTransactionRepository,
    usersRepository,
    bookingsRepository,
  );

  return assignBonusUseCase;
}
