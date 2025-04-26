import { PrismaFeriadosRepository } from '@/repositories/prisma/prisma-feriados-repository';
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { CreateHolidayUseCase } from '../feriados/create-feriado-professional-use-case';

export function makeCreateHolidayUseCase() {
  const feriadosRepository = new PrismaFeriadosRepository();
  const professionalsRepository = new PrismaProfessionalsRepository();
  const useCase = new CreateHolidayUseCase(
    feriadosRepository,
    professionalsRepository,
  );

  return useCase;
}
