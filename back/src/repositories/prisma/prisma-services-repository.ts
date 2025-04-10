import { Prisma, Service } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { ServicesRepository } from '../services-repository';

export interface ListServicesParams {
  page: number;
  limit: number;
  nome?: string;
  categoria?: string;
  ativo?: boolean;
  professionalId?: string;
}

export class PrismaServicesRepository implements ServicesRepository {
  async create(data: Prisma.ServiceCreateInput): Promise<Service> {
    const service = await prisma.service.create({
      data,
    });

    return service;
  }

  async findById(id: string): Promise<Service | null> {
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        profissionais: {
          include: {
            professional: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    return service;
  }

  async findByName(name: string): Promise<Service | null> {
    const service = await prisma.service.findFirst({
      where: {
        nome: name,
      },
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

  async list({
    page,
    limit,
    nome,
    categoria,
    ativo,
    professionalId,
  }: ListServicesParams): Promise<{ services: Service[]; total: number }> {
    const where: Prisma.ServiceWhereInput = {};

    if (nome) {
      where.nome = {
        contains: nome,
        mode: 'insensitive',
      };
    }

    if (categoria) {
      where.categoria = categoria;
    }

    if (ativo !== undefined) {
      where.ativo = ativo;
    }

    if (professionalId) {
      where.profissionais = {
        some: {
          id: professionalId,
        },
      };
    }

    const services = await prisma.service.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { nome: 'asc' },
      include: {
        Professional: true,
      },
    });

    const total = await prisma.service.count({
      where,
    });

    return {
      services,
      total,
    };
  }
}
