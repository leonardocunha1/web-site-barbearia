import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { PrismaHorariosFuncionamentoRepository } from '@/repositories/prisma/prisma-horarios-funcionamento-repository';
import { CreateBusinessHoursUseCase } from '../horario-funcionamento/create-horario-funcionamento-profissional-use-case';

export function makeCreateBusinessHoursUseCase() {
  const professionalsRepository = new PrismaProfessionalsRepository();
  const horariosRepository = new PrismaHorariosFuncionamentoRepository();
  const useCase = new CreateBusinessHoursUseCase(
    horariosRepository,
    professionalsRepository,
  );

  return useCase;
}
