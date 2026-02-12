import { PrismaHolidaysRepository } from '@/repositories/prisma/prisma-holidays-repository';
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { CreateHolidayUseCase } from '../holidays/create-holiday-use-case';

export function makeCreateHolidayUseCase() {
  const holidaysRepository = new PrismaHolidaysRepository();
  const professionalsRepository = new PrismaProfessionalsRepository();
  const useCase = new CreateHolidayUseCase(holidaysRepository, professionalsRepository);

  return useCase;
}
