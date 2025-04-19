import { Prisma, Professional, Service, User } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { ProfessionalsRepository } from '../professionals-repository';

export class PrismaProfessionalsRepository implements ProfessionalsRepository {
  async findById(id: string): Promise<Professional | null> {
    return prisma.professional.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string): Promise<Professional | null> {
    return prisma.professional.findUnique({
      where: { userId },
    });
  }

  async findByProfessionalId(
    id: string,
  ): Promise<(Professional & { user: User }) | null> {
    return prisma.professional.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async create(data: Prisma.ProfessionalCreateInput): Promise<Professional> {
    return prisma.professional.create({
      data,
    });
  }

  async update(
    id: string,
    data: Prisma.ProfessionalUncheckedUpdateInput,
  ): Promise<Professional> {
    return prisma.professional.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.professional.delete({
      where: { id },
    });
  }

  async list(params: {
    page: number;
    limit: number;
    especialidade?: string;
    ativo?: boolean;
  }): Promise<(Professional & { user: User; services: Service[] })[]> {
    const skip = (params.page - 1) * params.limit;

    const where: Prisma.ProfessionalWhereInput = {
      especialidade: params.especialidade
        ? {
            contains: params.especialidade,
            mode: Prisma.QueryMode.insensitive,
          }
        : undefined,
      ativo: params.ativo,
    };

    const professionals = await prisma.professional.findMany({
      where,
      skip,
      take: params.limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        ServiceProfessional: {
          select: {
            service: true,
          },
        },
      },
    });

    return professionals.map((professional) => ({
      ...professional,
      services: professional.ServiceProfessional.map((sp) => sp.service),
    }));
  }

  async count(params: {
    especialidade?: string;
    ativo?: boolean;
  }): Promise<number> {
    const where: Prisma.ProfessionalWhereInput = {
      especialidade: params.especialidade
        ? {
            contains: params.especialidade,
            mode: Prisma.QueryMode.insensitive,
          }
        : undefined,
      ativo: params.ativo,
    };

    return prisma.professional.count({ where });
  }

  async search(params: {
    query: string;
    page: number;
    limit: number;
    ativo?: boolean;
  }): Promise<
    (Professional & {
      user: User;
      services: Service[];
    })[]
  > {
    const skip = (params.page - 1) * params.limit;

    const results = await prisma.professional.findMany({
      where: {
        OR: [
          { especialidade: { contains: params.query, mode: 'insensitive' } },
          {
            ServiceProfessional: {
              some: {
                service: {
                  OR: [
                    { nome: { contains: params.query, mode: 'insensitive' } },
                    {
                      descricao: {
                        contains: params.query,
                        mode: 'insensitive',
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
        ativo: params.ativo,
      },
      skip,
      take: params.limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        ServiceProfessional: {
          select: {
            service: true,
          },
        },
      },
    });

    return results.map((professional) => ({
      ...professional,
      services: professional.ServiceProfessional.map((sp) => sp.service),
    }));
  }

  async countSearch(params: {
    query: string;
    ativo?: boolean;
  }): Promise<number> {
    return prisma.professional.count({
      where: {
        OR: [
          { especialidade: { contains: params.query, mode: 'insensitive' } },
          {
            ServiceProfessional: {
              some: {
                service: {
                  OR: [
                    { nome: { contains: params.query, mode: 'insensitive' } },
                    {
                      descricao: {
                        contains: params.query,
                        mode: 'insensitive',
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
        ativo: params.ativo,
      },
    });
  }
}
