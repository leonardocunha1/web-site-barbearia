import { holidaysRepository, professionalsRepository } from '@/repositories/prisma/instances';
import { CreateHolidayUseCase } from '../holidays/create-holiday-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeCreateHolidayUseCase() {
  const useCase = new CreateHolidayUseCase(holidaysRepository, professionalsRepository);

  return traceUseCase('holiday.create', useCase);
}
