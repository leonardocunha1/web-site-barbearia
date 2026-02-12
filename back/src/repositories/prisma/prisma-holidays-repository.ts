import { prisma } from '@/lib/prisma';
import { startOfDay, endOfDay } from 'date-fns';
import { IHolidaysRepository } from '../holidays-repository';

export class PrismaHolidaysRepository implements IHolidaysRepository {
  async isProfessionalHoliday(professionalId: string, date: Date) {
    const startOfDayDate = startOfDay(date);
    const endOfDayDate = endOfDay(date);

    return prisma.holiday.findFirst({
      where: {
        professionalId,
        date: {
          gte: startOfDayDate,
          lte: endOfDayDate,
        },
      },
      select: { reason: true },
    });
  }

  async addHoliday(professionalId: string, date: Date, reason: string) {
    await prisma.holiday.create({
      data: {
        professionalId,
        date,
        reason,
      },
    });
  }

  async findByProfessionalAndDate(professionalId: string, date: Date) {
    const startOfDayDate = startOfDay(date);
    const endOfDayDate = endOfDay(date);

    return prisma.holiday.findFirst({
      where: {
        professionalId,
        date: {
          gte: startOfDayDate,
          lte: endOfDayDate,
        },
      },
      select: {
        id: true,
        reason: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.holiday.findUnique({
      where: { id },
      select: {
        id: true,
        professionalId: true,
        date: true,
        reason: true,
      },
    });
  }

  async delete(id: string) {
    await prisma.holiday.delete({
      where: { id },
    });
  }

  async findManyByProfessionalId(
    professionalId: string,
    { page, limit }: { page: number; limit: number },
  ) {
    return prisma.holiday.findMany({
      where: {
        professionalId,
      },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        professionalId: true,
        date: true,
        reason: true,
      },
    });
  }

  async countByProfessionalId(professionalId: string) {
    return prisma.holiday.count({
      where: {
        professionalId,
      },
    });
  }
}
