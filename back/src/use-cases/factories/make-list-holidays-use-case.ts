import { PrismaFeriadosRepository } from '@/repositories/prisma/prisma-feriados-repository';
import { ListHolidaysUseCase } from '../feriados/list-feriado-professional-use-case';

export function makeListHolidaysUseCase() {
  const feriadosRepository = new PrismaFeriadosRepository();
  const listHolidaysUseCase = new ListHolidaysUseCase(feriadosRepository);

  return listHolidaysUseCase;
}
