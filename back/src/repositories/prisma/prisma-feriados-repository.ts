import { prisma } from '@/lib/prisma';
import { startOfDay, endOfDay } from 'date-fns';
import { FeriadosRepository } from '../feriados-repository';

export class PrismaFeriadosRepository implements FeriadosRepository {
  async isProfessionalHoliday(professionalId: string, date: Date) {
    const startOfDayDate = startOfDay(date); // Início do dia
    const endOfDayDate = endOfDay(date); // Fim do dia

    return prisma.feriado.findFirst({
      where: {
        profissionalId: professionalId,
        data: {
          gte: startOfDayDate, // Maior ou igual ao início do dia
          lte: endOfDayDate, // Menor ou igual ao fim do dia
        },
      },
      select: {
        motivo: true,
      },
    });
  }

  async addHoliday(professionalId: string, date: Date, motivo: string) {
    await prisma.feriado.create({
      data: {
        profissionalId: professionalId,
        data: date,
        motivo,
      },
    });
  }

  async findByProfessionalAndDate(professionalId: string, date: Date) {
    const startOfDayDate = startOfDay(date);
    const endOfDayDate = endOfDay(date);

    return prisma.feriado.findFirst({
      where: {
        profissionalId: professionalId,
        data: {
          gte: startOfDayDate,
          lte: endOfDayDate,
        },
      },
      select: {
        id: true,
        motivo: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.feriado.findUnique({
      where: { id },
      select: {
        id: true,
        profissionalId: true,
        data: true,
        motivo: true,
      },
    });
  }

  async delete(id: string) {
    await prisma.feriado.delete({
      where: { id },
    });
  }
}
