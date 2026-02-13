import { Prisma, Professional, Service, User } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { IProfessionalsRepository } from '../professionals-repository';

export class PrismaProfessionalsRepository implements IProfessionalsRepository {
  async listAllServices(): Promise<Service[]> {
    return prisma.service.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string): Promise<Professional | null> {
    return prisma.professional.findUnique({ where: { id } });
  }

  async findByUserId(userId: string): Promise<Professional | null> {
    return prisma.professional.findUnique({ where: { userId } });
  }

  async findByProfessionalId(id: string): Promise<(Professional & { user: User }) | null> {
    return prisma.professional.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async create(data: Prisma.ProfessionalCreateInput): Promise<Professional> {
    return prisma.professional.create({ data });
  }

  async update(id: string, data: Prisma.ProfessionalUncheckedUpdateInput): Promise<Professional> {
    return prisma.professional.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.professional.delete({ where: { id } });
  }

  async list(params: {
    page: number;
    limit: number;
    specialty?: string;
    active?: boolean;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
  }): Promise<
    (Professional & {
      user: User;
      services: (Service & { linked: boolean })[];
    })[]
  > {
    const skip = (params.page - 1) * params.limit;

    const where: Prisma.ProfessionalWhereInput = {
      ...(params.specialty && {
        specialty: {
          contains: params.specialty,
          mode: Prisma.QueryMode.insensitive,
        },
      }),
      ...(params.active !== undefined && { active: params.active }),
    };

    // Mapear campos de ordenação incluindo campos da relação User
    let orderBy: Prisma.ProfessionalOrderByWithRelationInput = {};

    if (params.sortBy) {
      const direction = params.sortDirection ?? 'asc';

      // Campos da tabela Professional
      if (params.sortBy === 'specialty') {
        orderBy = { specialty: direction };
      } else if (params.sortBy === 'active') {
        orderBy = { active: direction };
      } else if (params.sortBy === 'createdAt') {
        orderBy = { createdAt: direction };
      } else if (params.sortBy === 'updatedAt') {
        orderBy = { updatedAt: direction };
      }
      // Campos da relação User
      else if (params.sortBy === 'name') {
        orderBy = { user: { name: direction } };
      } else if (params.sortBy === 'email') {
        orderBy = { user: { email: direction } };
      } else {
        // Campo não permitido, usar padrão
        orderBy = { createdAt: 'desc' };
      }
    } else {
      orderBy = { createdAt: 'desc' };
    }

    const professionals = await prisma.professional.findMany({
      where,
      skip,
      take: params.limit,
      orderBy,
      include: {
        user: true,
        ServiceProfessional: {
          select: { service: true },
        },
      },
    });

    const allServices = await this.listAllServices();

    return professionals.map((professional) => {
      const linkedIds = professional.ServiceProfessional.map((sp) => sp.service.id);
      const servicesWithLinked = allServices.map((service) => ({
        ...service,
        linked: linkedIds.includes(service.id),
      }));

      return {
        ...professional,
        services: servicesWithLinked,
      };
    });
  }

  async count(params: { specialty?: string; active?: boolean }): Promise<number> {
    const where: Prisma.ProfessionalWhereInput = {
      ...(params.specialty && {
        specialty: {
          contains: params.specialty,
          mode: Prisma.QueryMode.insensitive,
        },
      }),
      ...(params.active !== undefined && { active: params.active }),
    };

    return prisma.professional.count({ where });
  }

  async search(params: {
    query: string;
    page: number;
    limit: number;
    active?: boolean;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
  }): Promise<
    (Professional & {
      user: User;
      services: (Service & { linked: boolean })[];
    })[]
  > {
    const skip = (params.page - 1) * params.limit;

    const where: Prisma.ProfessionalWhereInput = {
      AND: [
        {
          OR: [
            { specialty: { contains: params.query, mode: 'insensitive' } },
            {
              ServiceProfessional: {
                some: {
                  service: {
                    OR: [
                      { name: { contains: params.query, mode: 'insensitive' } },
                      {
                        description: {
                          contains: params.query,
                          mode: 'insensitive',
                        },
                      },
                    ],
                  },
                },
              },
            },
            {
              user: {
                OR: [
                  { name: { contains: params.query, mode: 'insensitive' } },
                  { email: { contains: params.query, mode: 'insensitive' } },
                ],
              },
            },
          ],
        },
        ...(params.active !== undefined ? [{ active: params.active }] : []),
      ],
    };

    let orderBy: Prisma.ProfessionalOrderByWithRelationInput = {};

    if (params.sortBy) {
      const direction = params.sortDirection ?? 'asc';

      if (params.sortBy === 'specialty') {
        orderBy = { specialty: direction };
      } else if (params.sortBy === 'active') {
        orderBy = { active: direction };
      } else if (params.sortBy === 'createdAt') {
        orderBy = { createdAt: direction };
      } else if (params.sortBy === 'updatedAt') {
        orderBy = { updatedAt: direction };
      } else if (params.sortBy === 'name') {
        orderBy = { user: { name: direction } };
      } else if (params.sortBy === 'email') {
        orderBy = { user: { email: direction } };
      } else {
        orderBy = { createdAt: 'desc' };
      }
    } else {
      orderBy = { createdAt: 'desc' };
    }

    const results = await prisma.professional.findMany({
      where,
      skip,
      take: params.limit,
      orderBy,
      include: {
        user: true,
        ServiceProfessional: {
          select: { service: true },
        },
      },
    });

    const allServices = await this.listAllServices();

    return results.map((professional) => {
      const linkedIds = professional.ServiceProfessional.map((sp) => sp.service.id);
      const servicesWithLinked = allServices.map((service) => ({
        ...service,
        linked: linkedIds.includes(service.id),
      }));

      return {
        ...professional,
        services: servicesWithLinked,
      };
    });
  }

  async countSearch(params: { query: string; active?: boolean }): Promise<number> {
    const where: Prisma.ProfessionalWhereInput = {
      AND: [
        {
          OR: [
            { specialty: { contains: params.query, mode: 'insensitive' } },
            {
              ServiceProfessional: {
                some: {
                  service: {
                    OR: [
                      { name: { contains: params.query, mode: 'insensitive' } },
                      {
                        description: {
                          contains: params.query,
                          mode: 'insensitive',
                        },
                      },
                    ],
                  },
                },
              },
            },
            {
              user: {
                OR: [
                  { name: { contains: params.query, mode: 'insensitive' } },
                  { email: { contains: params.query, mode: 'insensitive' } },
                ],
              },
            },
          ],
        },
        ...(params.active !== undefined ? [{ active: params.active }] : []),
      ],
    };

    return prisma.professional.count({ where });
  }

  async countActiveOnly(): Promise<number> {
    return prisma.professional.count({
      where: { active: true },
    });
  }

  async countNewByDateRange(startDate: Date, endDate: Date): Promise<number> {
    return prisma.professional.count({
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
    });
  }

  async findTopWithInclude(limit: number): Promise<(Professional & { user: User })[]> {
    return prisma.professional.findMany({
      where: { active: true },
      include: { user: true },
      take: limit,
    });
  }
}
