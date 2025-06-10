import { prisma } from '@/lib/prisma';
import { startOfDay, endOfDay } from 'date-fns';
import { FeriadosRepository } from '../feriados-repository';

export class PrismaFeriadosRepository implements FeriadosRepository {
  async isProfessionalHoliday(professionalId: string, date: Date) {
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

  async findManyByProfessionalId(
    professionalId: string,
    { page, limit }: { page: number; limit: number },
  ) {
    return prisma.feriado.findMany({
      where: {
        profissionalId: professionalId,
      },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        profissionalId: true,
        data: true,
        motivo: true,
      },
    });
  }

  async countByProfessionalId(professionalId: string) {
    return prisma.feriado.count({
      where: {
        profissionalId: professionalId,
      },
    });
  }
}
