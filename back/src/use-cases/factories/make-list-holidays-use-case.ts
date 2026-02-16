import { PrismaHolidaysRepository } from '@/repositories/prisma/prisma-holidays-repository';
import { ListHolidaysUseCase } from '../holidays/list-holidays-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeListHolidaysUseCase() {
  const holidaysRepository = new PrismaHolidaysRepository();
  const listHolidaysUseCase = new ListHolidaysUseCase(holidaysRepository);

  return traceUseCase('holiday.list', listHolidaysUseCase);
}
