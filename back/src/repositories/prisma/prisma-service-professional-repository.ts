import { prisma } from '@/lib/prisma';
import { IServiceProfessionalRepository } from '../service-professional-repository';
import { Prisma } from '@prisma/client';

export class PrismaServiceProfessionalRepository implements IServiceProfessionalRepository {
  async create(data: Prisma.ServiceProfessionalCreateInput): Promise<{
    id: string;
    serviceId: string;
    professionalId: string;
    price: number;
    duration: number;
  }> {
    const created = await prisma.serviceProfessional.create({
      data,
    });

    return {
      id: created.id,
      serviceId: created.serviceId,
      professionalId: created.professionalId,
      price: created.price,
      duration: created.duration,
    };
  }

  async delete(id: string): Promise<void> {
    await prisma.serviceProfessional.delete({
      where: { id },
    });
  }

  async deleteByServiceAndProfessional(serviceId: string, professionalId: string): Promise<void> {
    await prisma.serviceProfessional.deleteMany({
      where: { serviceId, professionalId },
    });
  }

  async findByServiceAndProfessional(serviceId: string, professionalId: string) {
    const result = await prisma.serviceProfessional.findFirst({
      where: {
        serviceId,
        professionalId,
      },
      select: {
        id: true,
        professionalId: true,
        price: true,
        duration: true,
        service: {
          select: {
            id: true,
            name: true,
            description: true,
            categoria: true,
            ativo: true,
          },
        },
      },
    });

    if (!result) {
      return null;
    }

    return {
      id: result.id,
      professionalId: result.professionalId,
      service: result.service,
      price: result.price,
      duration: result.duration,
    };
  }

  async findByProfessional(
    professionalId: string,
    options: {
      page?: number;
      limit?: number;
      activeOnly?: boolean;
    } = {},
  ): Promise<{
    services: Array<{
      service: {
        id: string;
        name: string;
        description: string | null;
        categoria: string | null;
        ativo: boolean;
      };
      price: number;
      duration: number;
    }>;
    total: number;
  }> {
    const { page = 1, limit = 10, activeOnly = true } = options;

    const where: Prisma.ServiceProfessionalWhereInput = {
      professionalId,
      service: activeOnly ? { ativo: true } : undefined,
    };

    const [serviceProfessionals, total] = await Promise.all([
      prisma.serviceProfessional.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          price: true,
          duration: true,
          service: {
            select: {
              id: true,
              name: true,
              description: true,
              categoria: true,
              ativo: true,
            },
          },
        },
        orderBy: {
          service: { name: 'asc' },
        },
      }),
      prisma.serviceProfessional.count({ where }),
    ]);

    return {
      services: serviceProfessionals.map((sp) => ({
        service: sp.service,
        price: sp.price,
        duration: sp.duration,
      })),
      total,
    };
  }

  async updateByServiceAndProfessional({
    serviceId,
    professionalId,
    preco,
    duracao,
  }: {
    serviceId: string;
    professionalId: string;
    price: number;
    duration: number;
  }): Promise<void> {
    await prisma.serviceProfessional.updateMany({
      where: {
        serviceId,
        professionalId,
      },
      date: {
        preco,
        duracao,
      },
    });
  }

  async findAllActiveWithProfessionalData(
    professionalId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    const { page = 1, limit = 10 } = options;

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where: { ativo: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          profissionais: {
            where: { professionalId },
            select: { price: true, duration: true },
          },
        },
      }),
      prisma.service.count({ where: { ativo: true } }),
    ]);

    return {
      services: services.map((s) => ({
        service: {
          id: s.id,
          name: s.name,
          description: s.description,
          categoria: s.category,
          ativo: s.active,
        },
        price: s.professionals[0]?.price ?? 0,
        duration: s.professionals[0]?.duration ?? 0,
      })),
      total,
    };
  }

  async findAllWithProfessionalData(
    professionalId: string,
    options: { page?: number; limit?: number } = {},
  ): Promise<{
    services: Array<{
      service: {
        id: string;
        name: string;
        description: string | null;
        categoria: string | null;
        ativo: boolean;
      };
      price: number | null;
      duration: number | null;
    }>;
    total: number;
  }> {
    const { page = 1, limit = 10 } = options;

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          profissionais: {
            where: { professionalId },
            select: { price: true, duration: true },
          },
        },
      }),
      prisma.service.count(),
    ]);

    return {
      services: services.map((s) => ({
        service: {
          id: s.id,
          name: s.name,
          description: s.description,
          categoria: s.category,
          ativo: s.active,
        },
        price: s.professionals[0]?.price ?? null,
        duration: s.professionals[0]?.duration ?? null,
      })),
      total,
    };
  }
}
