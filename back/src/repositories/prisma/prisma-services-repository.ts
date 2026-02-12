import { Prisma, Service } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { IServicesRepository } from '../services-repository';

export interface ListServicesParams {
  page: number;
  limit: number;
  nome?: string;
  categoria?: string;
  ativo?: boolean;
  professionalId?: string;
}

const includeProfessional = {
  profissionais: {
    include: {
      professional: {
        include: {
          user: {
            select: {
              id: true, name: true,
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
      where: { name: name,
      },
      include: includeProfessional,
    });

    return service;
  }

  async update(id: string, date: Prisma.ServiceUpdateInput): Promise<Service> {
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
      where: { id }, date: {
        ativo: false,
      },
    });
  }

  async toggleStatus(id: string, newStatus: boolean): Promise<Service> {
    return prisma.service.update({
      where: { id }, date: {
        ativo: newStatus,
      },
    });
  }

  async list({
    page,
    limit,
    nome,
    categoria,
    ativo,
    professionalId,
  }: ListServicesParams) {
    const where: Prisma.ServiceWhereInput = {};

    if (nome) {
      where.name = {
        contains: nome,
        mode: 'insensitive',
      };
    }

    if (categoria) {
      where.category = categoria;
    }

    if (ativo !== undefined) {
      where.active = ativo;
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

