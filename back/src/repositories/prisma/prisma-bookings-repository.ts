import { Prisma, Status } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
  IBookingsRepository,
  FindManyByProfessionalIdParams,
  FindManyByUserIdParams,
} from '../bookings-repository';
import { SortBookingSchema } from '@/schemas/booking-sort-schema';
import { BookingDTO } from '@/dtos/booking-dto';

const bookingInclude = {
  items: {
    select: {
      id: true, duration: true, price: true,
    },
    include: {
      serviceProfessional: {
        select: {
          id: true,
        },
        include: {
          service: {
            select: {
              id: true, name: true,
            },
          },
        },
      },
    },
  }, professional: {
    select: {
      id: true,
    },
    include: {
      user: {
        select: {
          id: true, name: true,
        },
      },
    },
  },
  user: {
    select: {
      id: true, name: true,
    },
  },
} satisfies Prisma.BookingInclude;

function mapSortToOrderBy(
  sort: SortBookingSchema[],
): Prisma.BookingOrderByWithRelationInput[] {
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
        professionalId: professionalId,
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
    const orderBy = mapSortToOrderBy(sort);

    const where: Prisma.BookingWhereInput = {
      professionalId: professionalId,
      ...(filters.status && { status: filters.status }),
      ...(filters.startDate && { startDateTime: { gte: filters.startDate } }),
      ...(filters.endDate && { endDateTime: { lte: filters.endDate } }),
    };

    return prisma.booking.findMany({
      where,

      include: bookingInclude,
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
      professionalId: professionalId,
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
    const orderBy = mapSortToOrderBy(sort);

    const where: Prisma.BookingWhereInput = {
      userId: userId,
      ...(filters?.status && { status: filters.status }),
      ...(filters?.startDate && { startDateTime: { gte: filters.startDate } }),
      ...(filters?.endDate && { endDateTime: { lte: filters.endDate } }),
    };

    return prisma.booking.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy,

      include: bookingInclude,
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
      userId: userId,
      ...(filters?.status && { status: filters.status }),
      ...(filters?.startDate && { startDateTime: { gte: filters.startDate } }),
      ...(filters?.endDate && { endDateTime: { lte: filters.endDate } }),
    };

    return prisma.booking.count({ where });
  }

  async update(
    id: string, date: Prisma.BookingUpdateInput,
  ): Promise<BookingDTO> {
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
        professionalId: professionalId,
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
      professionalId: professionalId,
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
      professionalId: professionalId,
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

  async findByProfessionalAndDate(
    professionalId: string,
    date: Date,
  ): Promise<BookingDTO[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.booking.findMany({
      where: {
        professionalId: professionalId,
        startDateTime: { gte: startOfDay, lte: endOfDay },
        status: { not: 'CANCELED' },
        canceledAt: null,
      },

      include: bookingInclude,
      orderBy: { startDateTime: 'asc' },
    });
  }

  async countByUserIdAndStatus(
    userId: string,
    status: Status,
  ): Promise<number> {
    const where: Prisma.BookingWhereInput = {
      userId: userId,
      status,
    };

    return prisma.booking.count({ where });
  }
}

