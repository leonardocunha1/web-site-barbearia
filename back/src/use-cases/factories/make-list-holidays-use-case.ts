import { holidaysRepository } from '@/repositories/prisma/instances';
import { ListHolidaysUseCase } from '../holidays/list-holidays-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeListHolidaysUseCase() {
  const listHolidaysUseCase = new ListHolidaysUseCase(holidaysRepository);

  return traceUseCase('holiday.list', listHolidaysUseCase);
}
