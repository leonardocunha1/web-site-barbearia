import { Prisma, Booking } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { BookingsRepository } from '../bookings-repository';

export class PrismaBookingsRepository implements BookingsRepository {
  async create(data: Prisma.BookingCreateInput): Promise<Booking> {
    const booking = await prisma.booking.create({
      data,
    });

    return booking;
  }

  async findById(id: string): Promise<Booking | null> {
    return prisma.booking.findUnique({
      where: {
        id,
      },
      include: {
        items: true, // retornando os itens relacionados junto com a consulta
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

  async findManyByProfessionalId(professionalId: string): Promise<Booking[]> {
    return prisma.booking.findMany({
      where: {
        profissionalId: professionalId,
      },
      orderBy: {
        dataHoraInicio: 'asc',
      },
    });
  }

  async findManyByUserId(userId: string): Promise<Booking[]> {
    return prisma.booking.findMany({
      where: {
        user: { id: userId },
      },
      orderBy: {
        dataHoraInicio: 'asc',
      },
    });
  }

  async update(id: string, data: Prisma.BookingUpdateInput): Promise<Booking> {
    return prisma.booking.update({
      where: { id },
      data,
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
}
