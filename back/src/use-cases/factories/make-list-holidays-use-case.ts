import { PrismaHolidaysRepository } from '@/repositories/prisma/prisma-holidays-repository';
import { ListHolidaysUseCase } from '../holidays/list-holidays-use-case';

export function makeListHolidaysUseCase() {
  const holidaysRepository = new PrismaHolidaysRepository();
  const listHolidaysUseCase = new ListHolidaysUseCase(holidaysRepository);

  return listHolidaysUseCase;
}
