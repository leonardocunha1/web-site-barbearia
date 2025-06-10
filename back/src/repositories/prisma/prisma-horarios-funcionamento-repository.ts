import { HorariosFuncionamentoRepository } from '@/repositories/horarios-funcionamento-repository';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export class PrismaHorariosFuncionamentoRepository
  implements HorariosFuncionamentoRepository
{
  async findById(id: string) {
    return prisma.horarioFuncionamento.findUnique({
      where: { id },
    });
  }

  async delete(id: string) {
    await prisma.horarioFuncionamento.delete({
      where: { id },
    });
  }

  async findByProfessionalAndDay(professionalId: string, dayOfWeek: number) {
    return prisma.horarioFuncionamento.findFirst({
      where: {
        profissionalId: professionalId,
        diaSemana: dayOfWeek,
      },
    });
  }

  async create(data: Prisma.HorarioFuncionamentoCreateInput) {
    const horarioFuncionamento = await prisma.horarioFuncionamento.create({
      data,
    });

    return horarioFuncionamento;
  }

  async update(id: string, data: Prisma.HorarioFuncionamentoUpdateInput) {
    return prisma.horarioFuncionamento.update({
      where: { id },
      data: {
        abreAs: data.abreAs,
        fechaAs: data.fechaAs,
        pausaInicio: data.pausaInicio,
        pausaFim: data.pausaFim,
      },
    });
  }

  async listByProfessional(professionalId: string) {
    return prisma.horarioFuncionamento.findMany({
      where: {
        profissionalId: professionalId,
        ativo: true,
      },
      orderBy: {
        diaSemana: 'asc',
      },
    });
  }
}
