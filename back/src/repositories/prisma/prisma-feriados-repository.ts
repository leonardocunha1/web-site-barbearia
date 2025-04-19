import { FeriadosRepository } from '@/repositories/feriados-repository';
import { prisma } from '@/lib/prisma';

export class PrismaFeriadosRepository implements FeriadosRepository {
  async isProfessionalHoliday(professionalId: string, date: Date) {
    return prisma.feriado.findFirst({
      where: {
        profissionalId: professionalId,
        data: {
          equals: date,
        },
      },
      select: {
        motivo: true,
      },
    });
  }
}
