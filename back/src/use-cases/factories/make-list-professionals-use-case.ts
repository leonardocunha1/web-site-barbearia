import { professionalsRepository } from '@/repositories/prisma/instances';
import { ListOrSearchProfessionalsUseCase } from '../professional/list-professionals-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeListProfessionalsUseCase() {
  const useCase = new ListOrSearchProfessionalsUseCase(professionalsRepository);

  return traceUseCase('professional.list', useCase);
}
