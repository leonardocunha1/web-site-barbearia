import { HorariosFuncionamentoRepository } from '@/repositories/horarios-funcionamento-repository';
import { prisma } from '@/lib/prisma';

export class PrismaHorariosFuncionamentoRepository
  implements HorariosFuncionamentoRepository
{
  async findByProfessionalAndDay(professionalId: string, dayOfWeek: number) {
    return prisma.horarioFuncionamento.findFirst({
      where: {
        profissionalId: professionalId,
        diaSemana: dayOfWeek,
      },
    });
  }
}
