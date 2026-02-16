import { Prisma, Status } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
  IBookingsRepository,
  FindManyByProfessionalIdParams,
  FindManyByUserIdParams,
} from '../bookings-repository';
import { SortBookingSchema } from '@/schemas/booking-sort-schema';
import { BookingDTO } from '@/dtos/booking-dto';
import tracer from '@/observability/tracer';

const bookingInclude = {
  items: {
    include: {
      serviceProfessional: {
        include: {
          service: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  },
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
  user: {
    select: {
      id: true,
      name: true,
    },
  },
  BonusTransaction: {
    select: {
      points: true,
      operation: true,
      type: true,
    },
  },
} satisfies Prisma.BookingInclude;

function mapSortToOrderBy(sort: SortBookingSchema[]): Prisma.BookingOrderByWithRelationInput[] {
  return sort.map(({ field, order }) => {
    if (field === 'PROFESSIONAL') {
      return { professional: { user: { name: order } } };
    }
    return { [field]: order };
  });
}

export class PrismaBookingsRepository implements IBookingsRepository {
  async create(data: Prisma.BookingCreateInput) {
    return await prisma.booking.create({
      data,
    });
  }

  async findById(id: string) {
    return prisma.booking.findUnique({
      where: { id },

      include: bookingInclude,
    });
  }

  async findOverlappingBooking(
    professionalId: string,
    start: Date,
    end: Date,
  ): Promise<BookingDTO | null> {
    return prisma.booking.findFirst({
      where: {
        professionalId,
        canceledAt: null,
        startDateTime: { lt: end },
        endDateTime: { gt: start },
        status: { not: 'CANCELED' },
      },

      include: bookingInclude,
    });
  }

  async findManyByProfessionalId(
    professionalId: string,
    { page, limit, sort = [], filters = {} }: FindManyByProfessionalIdParams,
  ): Promise<BookingDTO[]> {
    return tracer.trace('repository.booking.find_many_by_professional', async (span) => {
      span.setTag('resource', 'booking');
      span.setTag('operation', 'read');
      span.setTag('professional.id', professionalId);
      span.setTag('pagination.page', page);
      span.setTag('pagination.limit', limit);
      span.setTag('filters.count', Object.keys(filters).length);

      // Check passivo: cancelar expirados antes de buscar
      await this.cancelExpiredIfNeeded();

      const orderBy = mapSortToOrderBy(sort);

      const where: Prisma.BookingWhereInput = {
        professionalId,
        ...(filters.status && { status: filters.status }),
        ...(filters.startDate && { startDateTime: { gte: filters.startDate } }),
        ...(filters.endDate && { endDateTime: { lte: filters.endDate } }),
      };

      const bookings = await prisma.booking.findMany({
        where,

        include: bookingInclude,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      });

      span.setTag('results.count', bookings.length);

      return bookings;
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
      professionalId,
      ...(filters?.status && { status: filters.status }),
      ...(filters?.startDate && { startDateTime: { gte: filters.startDate } }),
      ...(filters?.endDate && { endDateTime: { lte: filters.endDate } }),
    };

    return prisma.booking.count({ where });
  }

  async findManyByUserId(
    userId: string,
    { page, limit, sort = [], filters = {} }: FindManyByUserIdParams,
  ): Promise<BookingDTO[]> {
    return tracer.trace('repository.booking.find_many_by_user', async (span) => {
      span.setTag('resource', 'booking');
      span.setTag('operation', 'read');
      span.setTag('user.id', userId);
      span.setTag('pagination.page', page);
      span.setTag('pagination.limit', limit);

      // Check passivo: cancelar expirados antes de buscar
      await this.cancelExpiredIfNeeded();

      const orderBy = mapSortToOrderBy(sort);

      const where: Prisma.BookingWhereInput = {
        userId,
        ...(filters?.status && { status: filters.status }),
        ...(filters?.startDate && { startDateTime: { gte: filters.startDate } }),
        ...(filters?.endDate && { endDateTime: { lte: filters.endDate } }),
      };

      const bookings = await prisma.booking.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: bookingInclude,
      });

      span.setTag('results.count', bookings.length);

      return bookings;
    });
  }

  async countByUserId(
    userId: string,
    filters?: {
      status?: Status;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<number> {
    const where: Prisma.BookingWhereInput = {
      userId,
      ...(filters?.status && { status: filters.status }),
      ...(filters?.startDate && { startDateTime: { gte: filters.startDate } }),
      ...(filters?.endDate && { endDateTime: { lte: filters.endDate } }),
    };

    return prisma.booking.count({ where });
  }

  async update(id: string, data: Prisma.BookingUpdateInput): Promise<BookingDTO> {
    return prisma.booking.update({
      where: { id },
      data,

      include: bookingInclude,
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
        professionalId,
        items: { some: { serviceId } },
        status: { not: 'CANCELED' },
        endDateTime: { gt: new Date() },
      },
    });
  }

  async countByProfessionalAndDate(
    professionalId: string,
    start: Date,
    end: Date,
    status?: Status,
  ): Promise<number> {
    return prisma.booking.count({
      where: {
        professionalId,
        startDateTime: { gte: start, lte: end },
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
      professionalId,
      startDateTime: { gte: start, lte: end },
    };

    if (status) {
      where.status = status;
    }

    const result = await prisma.booking.aggregate({
      where,
      _sum: { totalAmount: true },
    });

    return Number(result._sum.totalAmount) || 0;
  }

  async countByProfessionalAndStatus(
    professionalId: string,
    status: Status,
    start?: Date,
    end?: Date,
  ): Promise<number> {
    return prisma.booking.count({
      where: {
        professionalId,
        status,
        ...(start && end ? { startDateTime: { gte: start, lte: end } } : {}),
      },
    });
  }

  async findNextAppointments(
    professionalId: string,
    limit: number,
    filters?: { startDate?: Date; endDate?: Date },
  ): Promise<BookingDTO[]> {
    const where: Prisma.BookingWhereInput = {
      professionalId,
      startDateTime: {
        gte: filters?.startDate || new Date(),
        ...(filters?.endDate ? { lte: filters.endDate } : {}),
      },
      status: { in: ['PENDING', 'CONFIRMED'] },
      canceledAt: null,
    };

    return prisma.booking.findMany({
      where,
      take: limit,
      orderBy: { startDateTime: 'asc' },

      include: bookingInclude,
    });
  }

  async findByProfessionalAndDate(professionalId: string, date: Date): Promise<BookingDTO[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.booking.findMany({
      where: {
        professionalId,
        startDateTime: { gte: startOfDay, lte: endOfDay },
        status: { not: 'CANCELED' },
        canceledAt: null,
      },

      include: bookingInclude,
      orderBy: { startDateTime: 'asc' },
    });
  }

  async countByUserIdAndStatus(userId: string, status: Status): Promise<number> {
    const where: Prisma.BookingWhereInput = {
      userId,
      status,
    };

    return prisma.booking.count({ where });
  }

  async countByStatus(
    status: Status,
    filters?: {
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<number> {
    const where: Prisma.BookingWhereInput = {
      status,
      ...(filters?.startDate && { startDateTime: { gte: filters.startDate } }),
      ...(filters?.endDate && { startDateTime: { lte: filters.endDate } }),
    };

    return prisma.booking.count({ where });
  }

  async countTodayBookings(): Promise<number> {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.booking.count({
      where: {
        startDateTime: { gte: startOfDay, lte: endOfDay },
      },
    });
  }

  async countCanceledLast24h(): Promise<number> {
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    return prisma.booking.count({
      where: {
        status: 'CANCELED',
        canceledAt: { gte: last24h },
      },
    });
  }

  async getRevenueByDateRange(startDate: Date, endDate: Date, status?: Status): Promise<number> {
    const result = await prisma.booking.aggregate({
      where: {
        startDateTime: { gte: startDate, lte: endDate },
        ...(status && { status }),
      },
      _sum: { totalAmount: true },
    });

    return Number(result._sum.totalAmount) || 0;
  }

  async getCompletedBookingsCountByDateRange(startDate: Date, endDate: Date): Promise<number> {
    return prisma.booking.count({
      where: {
        status: 'COMPLETED',
        startDateTime: { gte: startDate, lte: endDate },
      },
    });
  }

  async getTopProfessionalsByCompletedBookings(
    startDate: Date,
    endDate: Date,
    limit: number,
  ): Promise<
    Array<{
      professionalId: string;
      totalBookings: number;
    }>
  > {
    const results = await prisma.booking.groupBy({
      by: ['professionalId'],
      where: {
        status: 'COMPLETED',
        startDateTime: { gte: startDate, lte: endDate },
      },
      _count: { _all: true },
      orderBy: [{ _count: { id: 'desc' } }],
      take: limit,
    });

    return results.map((item) => ({
      professionalId: item.professionalId,
      totalBookings: (item._count as unknown as { _all: number })._all,
    }));
  }

  async findExpiredPendingBookings(currentDate: Date) {
    return prisma.booking.findMany({
      where: {
        status: 'PENDING',
        startDateTime: { lt: currentDate },
        canceledAt: null,
      },
    });
  }

  async cancelExpiredBookings(bookingIds: string[]): Promise<number> {
    if (bookingIds.length === 0) return 0;

    const result = await prisma.booking.updateMany({
      where: { id: { in: bookingIds } },
      data: {
        status: 'CANCELED',
        canceledAt: new Date(),
        notes: 'Cancelado automaticamente por falta de confirmação',
      },
    });

    return result.count;
  }

  /**
   * Check passivo: cancela agendamentos expirados se necessário
   * Evita chamadas frequentes usando cache de 5 minutos
   */
  private lastCheck: Date | null = null;
  private readonly CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutos

  private async cancelExpiredIfNeeded(): Promise<void> {
    const now = new Date();

    // Se já checou nos últimos 5 minutos, ignora
    if (this.lastCheck && now.getTime() - this.lastCheck.getTime() < this.CHECK_INTERVAL_MS) {
      return;
    }

    this.lastCheck = now;

    // Busca e cancela em uma query
    const expired = await this.findExpiredPendingBookings(now);
    if (expired.length > 0) {
      await this.cancelExpiredBookings(expired.map((b) => b.id));
    }
  }

  async getServiceBreakdownByProfessional(
    professionalId: string,
    startDate: Date,
    endDate: Date,
    limit = 5,
  ): Promise<
    Array<{
      serviceName: string;
      count: number;
    }>
  > {
    const results = await prisma.bookingItem.groupBy({
      by: ['serviceId'],
      where: {
        booking: {
          professionalId,
          startDateTime: { gte: startDate, lte: endDate },
          status: { not: 'CANCELED' },
          canceledAt: null,
        },
        serviceId: { not: null },
      },
      _count: { _all: true },
      orderBy: [{ _count: { id: 'desc' } }],
      take: limit,
    });

    const serviceIds = results.map((r) => r.serviceId).filter((id): id is string => id !== null);

    if (serviceIds.length === 0) {
      return [];
    }

    const services = await prisma.service.findMany({
      where: {
        id: { in: serviceIds },
      },
      select: { id: true, name: true },
    });

    const serviceMap = new Map(services.map((s) => [s.id, s.name]));

    return results
      .map((r) => ({
        serviceName: r.serviceId
          ? serviceMap.get(r.serviceId) || 'Serviço não identificado'
          : 'Serviço não identificado',
        count: (r._count as unknown as { _all: number })._all,
      }))
      .filter((item) => item.serviceName !== 'Serviço não identificado');
  }

  async countByProfessionalAndStatusRange(
    professionalId: string,
    status: Status,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    return prisma.booking.count({
      where: {
        professionalId,
        status,
        startDateTime: { gte: startDate, lte: endDate },
      },
    });
  }
}
