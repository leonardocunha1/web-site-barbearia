import { UpdateBusinessHoursUseCase } from '../horario-funcionamento/update-horario-funcionamento-profissional-use-case';
import { PrismaHorariosFuncionamentoRepository } from '@/repositories/prisma/prisma-horarios-funcionamento-repository';
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';

export function makeUpdateBusinessHoursUseCase() {
  const horariosRepository = new PrismaHorariosFuncionamentoRepository();
  const professionalsRepository = new PrismaProfessionalsRepository();

  const useCase = new UpdateBusinessHoursUseCase(
    horariosRepository,
    professionalsRepository,
  );

  return useCase;
}
