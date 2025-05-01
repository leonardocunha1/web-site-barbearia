import { Prisma, Booking, Status } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { BookingsRepository } from '../bookings-repository';
import { SortBookingSchema } from '@/schemas/booking-sort-schema';

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

  async findById(id: string): Promise<Booking | null> {
    return prisma.booking.findUnique({
      where: {
        id,
      },
      include: {
        items: true,
      },
    });
  }

  async findOverlappingBooking(
    professionalId: string,
    start: Date,
    end: Date,
  ): Promise<Booking | null> {
    return prisma.booking.findFirst({
      where: {
        profissionalId: professionalId,
        canceledAt: null,
        dataHoraInicio: { lt: end },
        dataHoraFim: { gt: start },
      },
    });
  }

  async findManyByProfessionalId(professionalId: string) {
    return prisma.booking.findMany({
      where: {
        profissionalId: professionalId,
      },
      orderBy: {
        dataHoraInicio: 'asc',
      },
      include: {
        items: true,
        profissional: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findManyByUserId(
    userId: string,
    {
      page,
      limit,
      sort = [{ field: 'dataHoraInicio', order: 'asc' }],
    }: {
      page: number;
      limit: number;
      sort?: Array<{
        field: 'dataHoraInicio' | 'profissional' | 'status' | 'valorFinal';
        order: 'asc' | 'desc';
      }>;
    },
  ) {
    const orderBy = mapSortToOrderBy(sort);

    return prisma.booking.findMany({
      where: {
        user: { id: userId },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy,
      include: {
        items: true,
        profissional: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async countByUserId(userId: string): Promise<number> {
    return prisma.booking.count({
      where: {
        user: { id: userId },
      },
    });
  }

  async update(id: string, data: Prisma.BookingUpdateInput) {
    return prisma.booking.update({
      where: { id },
      data,
      include: {
        items: true,
        profissional: {
          include: {
            user: true,
          },
        },
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
        items: {
          some: {
            serviceId,
          },
        },
        status: {
          not: 'CANCELADO',
        },
        dataHoraFim: {
          gt: new Date(), // Apenas agendamentos futuros
        },
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
        dataHoraInicio: {
          gte: start,
          lte: end,
        },
        ...(status ? { status } : {}),
      },
    });
  }

  async getEarningsByProfessionalAndDate(
    professionalId: string,
    start: Date,
    end: Date,
    status?: Status,
  ) {
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
        ...(start && end
          ? {
              dataHoraInicio: {
                gte: start,
                lte: end,
              },
            }
          : {}),
      },
    });
  }

  async getMonthlyEarnings(
    professionalId: string,
    month?: number,
    year?: number,
  ) {
    const date = new Date();
    const targetMonth = month ?? date.getMonth();
    const targetYear = year ?? date.getFullYear();

    const start = new Date(targetYear, targetMonth, 1);
    const end = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);

    return this.getEarningsByProfessionalAndDate(
      professionalId,
      start,
      end,
      'CONCLUIDO',
    );
  }

  async findNextAppointments(
    professionalId: string,
    limit: number,
    filters?: { startDate?: Date; endDate?: Date },
  ) {
    const where: Prisma.BookingWhereInput = {
      profissionalId: professionalId,
      dataHoraInicio: {
        gte: filters?.startDate || new Date(),
        lte: filters?.endDate,
      },
      status: {
        in: ['PENDENTE', 'CONFIRMADO'],
      },
    };

    return prisma.booking.findMany({
      where,
      take: limit,
      orderBy: { dataHoraInicio: 'asc' },
      select: {
        id: true,
        dataHoraInicio: true,
        status: true,
        user: { select: { nome: true } },
        items: { select: { service: { select: { nome: true } } } },
      },
    });
  }

  async findByProfessionalAndDate(professionalId: string, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.booking.findMany({
      where: {
        profissionalId: professionalId,
        dataHoraInicio: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          not: 'CANCELADO',
        },
      },
      select: {
        id: true,
        dataHoraInicio: true,
        dataHoraFim: true,
        status: true,
        user: {
          select: {
            nome: true,
          },
        },
        items: {
          select: {
            service: {
              select: {
                nome: true,
              },
            },
          },
        },
      },
      orderBy: {
        dataHoraInicio: 'asc',
      },
    });
  }
}
