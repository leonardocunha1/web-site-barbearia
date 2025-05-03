import { PrismaHorariosFuncionamentoRepository } from '@/repositories/prisma/prisma-horarios-funcionamento-repository';
import { DeleteBusinessHoursUseCase } from '../horario-funcionamento/delete-horario-funcionamento-profissional-use-case';

export function makeDeleteBusinessHoursUseCase() {
  const horariosRepository = new PrismaHorariosFuncionamentoRepository();
  const useCase = new DeleteBusinessHoursUseCase(horariosRepository);

  return useCase;
}
