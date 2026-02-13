import { IBusinessHoursRepository } from '@/repositories/business-hours-repository';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export class PrismaBusinessHoursRepository implements IBusinessHoursRepository {
  async findById(id: string) {
    return prisma.businessHours.findUnique({
      where: { id },
    });
  }

  async delete(id: string) {
    await prisma.businessHours.delete({
      where: { id },
    });
  }

  async findByProfessionalAndDay(professionalId: string, dayOfWeek: number) {
    return prisma.businessHours.findFirst({
      where: {
        professionalId,
        dayOfWeek,
      },
    });
  }

  async create(data: Prisma.BusinessHoursCreateInput) {
    const businessHours = await prisma.businessHours.create({
      data,
    });

    return businessHours;
  }

  async update(id: string, data: Prisma.BusinessHoursUpdateInput) {
    return prisma.businessHours.update({
      where: { id },
      data: {
        opensAt: data.opensAt,
        closesAt: data.closesAt,
        breakStart: data.breakStart,
        breakEnd: data.breakEnd,
      },
    });
  }

  async listByProfessional(professionalId: string) {
    return prisma.businessHours.findMany({
      where: {
        professionalId,
        active: true,
      },
      orderBy: {
        dayOfWeek: 'asc',
      },
    });
  }
}
