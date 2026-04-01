import { userBonusRepository, usersRepository } from '@/repositories/prisma/instances';
import { GetBalanceUseCase } from '../bonus/get-balance-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeGetBalanceUseCase() {
  const getBalanceUseCase = new GetBalanceUseCase(userBonusRepository, usersRepository);

  return traceUseCase('bonus.get_balance', getBalanceUseCase);
}
