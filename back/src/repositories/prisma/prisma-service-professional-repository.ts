import { prisma } from '@/lib/prisma';
import { ServiceProfessionalRepository } from '../service-professional-repository';
import { Prisma } from '@prisma/client';

export class PrismaServiceProfessionalRepository
  implements ServiceProfessionalRepository
{
  async create(data: Prisma.ServiceProfessionalCreateInput): Promise<{
    id: string;
    serviceId: string;
    professionalId: string;
    preco: number;
    duracao: number;
  }> {
    const created = await prisma.serviceProfessional.create({
      data,
    });

    return {
      id: created.id,
      serviceId: created.serviceId,
      professionalId: created.professionalId,
      preco: created.preco,
      duracao: created.duracao,
    };
  }

  async delete(id: string): Promise<void> {
    await prisma.serviceProfessional.delete({
      where: { id },
    });
  }

  async deleteByServiceAndProfessional(
  serviceId: string,
  professionalId: string,
): Promise<void> {
  await prisma.serviceProfessional.deleteMany({
    where: { serviceId, professionalId },
  });
}


  async findByServiceAndProfessional(
    serviceId: string,
    professionalId: string,
  ) {
    const result = await prisma.serviceProfessional.findFirst({
      where: {
        serviceId,
        professionalId,
      },
      select: {
        id: true,
        professionalId: true,
        preco: true,
        duracao: true,
        service: {
          select: {
            id: true,
            nome: true,
            descricao: true,
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
      preco: result.preco,
      duracao: result.duracao,
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
        nome: string;
        descricao: string | null;
        categoria: string | null;
        ativo: boolean;
      };
      preco: number;
      duracao: number;
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
          preco: true,
          duracao: true,
          service: {
            select: {
              id: true,
              nome: true,
              descricao: true,
              categoria: true,
              ativo: true,
            },
          },
        },
        orderBy: {
          service: {
            nome: 'asc',
          },
        },
      }),
      prisma.serviceProfessional.count({ where }),
    ]);

    return {
      services: serviceProfessionals.map((sp) => ({
        service: sp.service,
        preco: sp.preco,
        duracao: sp.duracao,
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
    preco: number;
    duracao: number;
  }): Promise<void> {
    await prisma.serviceProfessional.updateMany({
      where: {
        serviceId,
        professionalId,
      },
      data: {
        preco,
        duracao,
      },
    });
  }
}
