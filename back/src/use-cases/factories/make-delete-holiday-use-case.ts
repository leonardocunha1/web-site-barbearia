import { PrismaHolidaysRepository } from '@/repositories/prisma/prisma-holidays-repository';
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { DeleteHolidayUseCase } from '../holidays/delete-holiday-use-case';

export function makeDeleteHolidayUseCase() {
  const holidaysRepository = new PrismaHolidaysRepository();
  const professionalsRepository = new PrismaProfessionalsRepository();
  const useCase = new DeleteHolidayUseCase(
    holidaysRepository,
    professionalsRepository,
  );

  return useCase;
}


