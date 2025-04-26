import { PrismaHorariosFuncionamentoRepository } from '@/repositories/prisma/prisma-horarios-funcionamento-repository';
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { ListBusinessHoursUseCase } from '../horario-funcionamento/list-horario-funcionamento-profissional-use-case';

export function makeListBusinessHoursUseCase() {
  const horariosRepository = new PrismaHorariosFuncionamentoRepository();
  const professionalsRepository = new PrismaProfessionalsRepository();

  const useCase = new ListBusinessHoursUseCase(
    horariosRepository,
    professionalsRepository,
  );

  return useCase;
}
