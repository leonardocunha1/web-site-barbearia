import { PrismaFeriadosRepository } from '@/repositories/prisma/prisma-feriados-repository';
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { DeleteHolidayUseCase } from '../feriados/delete-feriado-professional-use-case';

export function makeDeleteHolidayUseCase() {
  const feriadosRepository = new PrismaFeriadosRepository();
  const professionalsRepository = new PrismaProfessionalsRepository();
  const useCase = new DeleteHolidayUseCase(
    feriadosRepository,
    professionalsRepository,
  );

  return useCase;
}
