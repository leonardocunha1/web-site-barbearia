import { Prisma, Status } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
  BookingsRepository,
  BookingWithRelations,
  FindManyByProfessionalIdParams,
  FindManyByUserIdParams,
} from '../bookings-repository';
import { SortBookingSchema } from '@/schemas/booking-sort-schema';

const bookingInclude = {
  items: {
    include: {
      serviceProfessional: {
        include: {
          service: true,
        },
      },
    },
  },
  profissional: {
    include: {
      user: true,
    },
  },
  user: true,
} satisfies Prisma.BookingInclude;

function mapSortToOrderBy(
  sort: SortBookingSchema[],
): Prisma.BookingOrderByWithRelationInput[] {
  return sort.map(({ field, order }) => {
    if (field === 'profissional') {
      return { profissional: { user: { nome: order } } };
    }
    return { [field]: order };
  });
}

export class PrismaBookingsRepository implements BookingsRepository {
  async create(data: Prisma.BookingCreateInput): Promise<void> {
    await prisma.booking.create({
      data,
    });
  }

  async findById(id: string): Promise<BookingWithRelations | null> {
    return prisma.booking.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            serviceProfessional: {
              include: {
                service: true,
              },
            },
          },
        },
        profissional: {
          include: {
            user: true,
          },
        },
        user: true,
      },
    });
  }

  async findOverlappingBooking(
    professionalId: string,
    start: Date,
    end: Date,
  ): Promise<BookingWithRelations | null> {
    return prisma.booking.findFirst({
      where: {
        profissionalId: professionalId,
        canceledAt: null,
        dataHoraInicio: { lt: end },
        dataHoraFim: { gt: start },
        status: { not: 'CANCELADO' }, // Adicionado filtro para status
      },
      include: bookingInclude, // Usando o include consistente
    });
  }

  async findManyByProfessionalId(
    professionalId: string,
    { page, limit, sort = [], filters = {} }: FindManyByProfessionalIdParams,
  ): Promise<BookingWithRelations[]> {
    const orderBy = mapSortToOrderBy(sort);

    const where: Prisma.BookingWhereInput = {
      profissionalId: professionalId,
      ...(filters.status && { status: filters.status }),
      ...(filters.startDate && { dataHoraInicio: { gte: filters.startDate } }),
      ...(filters.endDate && { dataHoraFim: { lte: filters.endDate } }),
    };

    return prisma.booking.findMany({
      where,
      include: {
        items: {
          include: {
            serviceProfessional: {
              include: {
                service: true,
              },
            },
          },
        },
        profissional: {
          include: {
            user: true,
          },
        },
        user: true,
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async countByProfessionalId(
    professionalId: string,
    filters?: {
      status?: Status;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<number> {
    const where: Prisma.BookingWhereInput = {
      profissionalId: professionalId,
      ...(filters?.status && { status: filters.status }),
      ...(filters?.startDate && { dataHoraInicio: { gte: filters.startDate } }),
      ...(filters?.endDate && { dataHoraFim: { lte: filters.endDate } }),
    };

    return prisma.booking.count({ where });
  }

  async findManyByUserId(
    userId: string,
    { page, limit, sort = [], filters = {} }: FindManyByUserIdParams,
  ): Promise<BookingWithRelations[]> {
    const orderBy = mapSortToOrderBy(sort);

    const where: Prisma.BookingWhereInput = {
      usuarioId: userId,
      ...(filters?.status && { status: filters.status }),
      ...(filters?.startDate && { dataHoraInicio: { gte: filters.startDate } }),
      ...(filters?.endDate && { dataHoraFim: { lte: filters.endDate } }),
    };

    return prisma.booking.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy,
      include: {
        items: {
          include: {
            serviceProfessional: {
              include: {
                service: true,
              },
            },
          },
        },
        profissional: {
          include: {
            user: true,
          },
        },
        user: true,
      },
    });
  }

  async countByUserId(userId: string): Promise<number> {
    return prisma.booking.count({
      where: { usuarioId: userId },
    });
  }

  async update(
    id: string,
    data: Prisma.BookingUpdateInput,
  ): Promise<BookingWithRelations> {
    return prisma.booking.update({
      where: { id },
      data,
      include: {
        items: {
          include: {
            serviceProfessional: {
              include: {
                service: true,
              },
            },
          },
        },
        profissional: {
          include: {
            user: true,
          },
        },
        user: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.booking.delete({
      where: { id },
    });
  }

  async countActiveByServiceAndProfessional(
    serviceId: string,
    professionalId: string,
  ): Promise<number> {
    return prisma.booking.count({
      where: {
        profissionalId: professionalId,
        items: { some: { serviceId } },
        status: { not: 'CANCELADO' },
        dataHoraFim: { gt: new Date() },
      },
    });
  }

  async countByProfessionalAndDate(
    profissionalId: string,
    start: Date,
    end: Date,
    status?: Status,
  ): Promise<number> {
    return prisma.booking.count({
      where: {
        profissionalId,
        dataHoraInicio: { gte: start, lte: end },
        ...(status ? { status } : {}),
      },
    });
  }

  async getEarningsByProfessionalAndDate(
    professionalId: string,
    start: Date,
    end: Date,
    status?: Status,
  ): Promise<number> {
    const where: Prisma.BookingWhereInput = {
      profissionalId: professionalId,
      dataHoraInicio: { gte: start, lte: end },
    };

    if (status) {
      where.status = status;
    }

    const result = await prisma.booking.aggregate({
      where,
      _sum: { valorFinal: true },
    });

    return Number(result._sum.valorFinal) || 0;
  }

  async countByProfessionalAndStatus(
    profissionalId: string,
    status: Status,
    start?: Date,
    end?: Date,
  ): Promise<number> {
    return prisma.booking.count({
      where: {
        profissionalId,
        status,
        ...(start && end ? { dataHoraInicio: { gte: start, lte: end } } : {}),
      },
    });
  }

  async findNextAppointments(
    professionalId: string,
    limit: number,
    filters?: { startDate?: Date; endDate?: Date },
  ): Promise<BookingWithRelations[]> {
    const where: Prisma.BookingWhereInput = {
      profissionalId: professionalId,
      dataHoraInicio: {
        gte: filters?.startDate || new Date(),
        ...(filters?.endDate ? { lte: filters.endDate } : {}),
      },
      status: { in: ['PENDENTE', 'CONFIRMADO'] },
      canceledAt: null, // Garantir que não está cancelado
    };

    return prisma.booking.findMany({
      where,
      take: limit,
      orderBy: { dataHoraInicio: 'asc' },
      include: bookingInclude, // Include consistente
    });
  }

  async findByProfessionalAndDate(
    professionalId: string,
    date: Date,
  ): Promise<BookingWithRelations[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.booking.findMany({
      where: {
        profissionalId: professionalId,
        dataHoraInicio: { gte: startOfDay, lte: endOfDay },
        status: { not: 'CANCELADO' },
        canceledAt: null, // Filtro adicional para garantir
      },
      include: bookingInclude, // Include consistente
      orderBy: { dataHoraInicio: 'asc' },
    });
  }
}
