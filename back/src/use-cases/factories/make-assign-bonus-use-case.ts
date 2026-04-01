import { userBonusRepository, bonusTransactionRepository, usersRepository, bookingsRepository } from '@/repositories/prisma/instances';
import { AssignBonusUseCase } from '../bonus/assign-bonus-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeAssignBonusUseCase() {
  const assignBonusUseCase = new AssignBonusUseCase(
    userBonusRepository,
    bonusTransactionRepository,
    usersRepository,
    bookingsRepository,
  );

  return traceUseCase('bonus.assign', assignBonusUseCase);
}
