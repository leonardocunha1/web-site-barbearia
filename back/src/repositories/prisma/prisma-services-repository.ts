import { Prisma, Service } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { IServicesRepository } from '../services-repository';

export interface ListServicesParams {
  page: number;
  limit: number;
  name?: string;
  category?: string;
  active?: boolean;
  professionalId?: string;
}

const includeProfessional = {
  professionals: {
    include: {
      professional: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  },
};

export class PrismaServicesRepository implements IServicesRepository {
  async create(data: Prisma.ServiceCreateInput): Promise<Service> {
    const service = await prisma.service.create({
      data,
    });

    return service;
  }

  async findById(id: string) {
    const service = await prisma.service.findUnique({
      where: { id },
      include: includeProfessional,
    });

    return service;
  }

  async findByName(name: string) {
    const service = await prisma.service.findFirst({
      where: { name },
      include: includeProfessional,
    });

    return service;
  }

  async update(id: string, data: Prisma.ServiceUpdateInput): Promise<Service> {
    const service = await prisma.service.update({
      where: { id },
      data,
    });

    return service;
  }

  async delete(id: string): Promise<void> {
    await prisma.service.delete({
      where: { id },
    });
  }

  async softDelete(id: string): Promise<void> {
    await prisma.service.update({
      where: { id },
      data: {
        active: false,
      },
    });
  }

  async toggleStatus(id: string, newStatus: boolean): Promise<Service> {
    return prisma.service.update({
      where: { id },
      data: {
        active: newStatus,
      },
    });
  }

  async list({ page, limit, name, category, active, professionalId }: ListServicesParams) {
    const where: Prisma.ServiceWhereInput = {};

    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    if (category) {
      where.category = category;
    }

    if (active !== undefined) {
      where.active = active;
    }

    if (professionalId) {
      where.professionals = {
        some: {
          professionalId,
        },
      };
    }

    const services = await prisma.service.findMany({
      where,
      include: includeProfessional,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: 'asc' },
    });

    const total = await prisma.service.count({
      where,
    });

    return {
      services,
      total,
    };
  }

  async existsProfessional(professionalId: string): Promise<boolean> {
    const count = await prisma.professional.count({
      where: { id: professionalId },
    });
    return count > 0;
  }

  async getTopServicesByBookingCount(
    startDate: Date,
    endDate: Date,
    limit: number,
  ): Promise<
    Array<{
      id: string;
      name: string;
      totalBookings: number;
    }>
  > {
    const results = await prisma.bookingItem.groupBy({
      by: ['serviceId'],
      where: {
        serviceId: { not: null },
        booking: {
          status: 'COMPLETED',
          startDateTime: { gte: startDate, lte: endDate },
        },
      },
      _count: { _all: true },
      orderBy: [{ _count: { id: 'desc' } }],
      take: limit,
    });

    const serviceIds = results.map((r) => r.serviceId).filter((id): id is string => Boolean(id));
    const services = await prisma.service.findMany({
      where: { id: { in: serviceIds } },
      select: { id: true, name: true },
    });

    const servicesMap = new Map(services.map((s) => [s.id, s.name]));

    return results
      .filter((r) => r.serviceId)
      .map((item) => ({
        id: item.serviceId as string,
        name: servicesMap.get(item.serviceId as string) ?? 'Serviço',
        totalBookings: (item._count as unknown as { _all: number })._all,
      }));
  }
}
