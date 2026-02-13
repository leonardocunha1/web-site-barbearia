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
            category: true,
            active: true,
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
        category: string | null;
        active: boolean;
      };
      price: number;
      duration: number;
    }>;
    total: number;
  }> {
    const { page = 1, limit = 10, activeOnly = true } = options;

    const where: Prisma.ServiceProfessionalWhereInput = {
      professionalId,
      service: activeOnly ? { active: true } : undefined,
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
              category: true,
              active: true,
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
    price,
    duration,
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
      data: {
        price,
        duration,
      },
    });
  }

  async findAllActiveWithProfessionalData(
    professionalId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    const { page = 1, limit = 10 } = options;

    // Buscar apenas serviços que TÊM vínculo com o profissional
    const [serviceProfessionals, total] = await Promise.all([
      prisma.serviceProfessional.findMany({
        where: {
          professionalId,
          service: { active: true },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          service: { name: 'asc' },
        },
        include: {
          service: {
            select: {
              id: true,
              name: true,
              description: true,
              category: true,
              active: true,
            },
          },
        },
      }),
      prisma.serviceProfessional.count({
        where: {
          professionalId,
          service: { active: true },
        },
      }),
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

  async findAllWithProfessionalData(
    professionalId: string,
    options: { page?: number; limit?: number } = {},
  ): Promise<{
    services: Array<{
      service: {
        id: string;
        name: string;
        description: string | null;
        category: string | null;
        active: boolean;
      };
      price: number | null;
      duration: number | null;
    }>;
    total: number;
  }> {
    const { page = 1, limit = 10 } = options;

    // Buscar apenas serviços que TÊM vínculo com o profissional
    const [serviceProfessionals, total] = await Promise.all([
      prisma.serviceProfessional.findMany({
        where: { professionalId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          service: { name: 'asc' },
        },
        include: {
          service: {
            select: {
              id: true,
              name: true,
              description: true,
              category: true,
              active: true,
            },
          },
        },
      }),
      prisma.serviceProfessional.count({ where: { professionalId } }),
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
}
