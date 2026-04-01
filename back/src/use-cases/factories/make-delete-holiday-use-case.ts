import { holidaysRepository, professionalsRepository } from '@/repositories/prisma/instances';
import { DeleteHolidayUseCase } from '../holidays/delete-holiday-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeDeleteHolidayUseCase() {
  const useCase = new DeleteHolidayUseCase(holidaysRepository, professionalsRepository);

  return traceUseCase('holiday.delete', useCase);
}
