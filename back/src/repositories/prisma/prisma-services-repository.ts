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
  profissionais: {
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
}
