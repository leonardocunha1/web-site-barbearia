import { prisma } from '@/lib/prisma';
import { IBonusTransactionRepository } from '../bonus-transaction-repository';
import { BonusTransaction, BonusType, Prisma } from '@prisma/client';

export class PrismaBonusTransactionRepository
  implements IBonusTransactionRepository
{
  async create( date: Prisma.BonusTransactionCreateInput,
  ): Promise<BonusTransaction> {
    return prisma.bonusTransaction.create({ date: {
        userId: data.user.connect?.id ?? '',
        bookingId: data.booking?.connect?.id ?? null,
        type: data.type,
        points: data.points,
        description: data.description,
      },
      include: {
        user: {
          select: {
            id: true, name: true,
          },
        },
        booking: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });
  }

  async findByBookingId(bookingId: string): Promise<BonusTransaction | null> {
    return prisma.bonusTransaction.findFirst({
      where: { bookingId },
      include: {
        user: {
          select: {
            id: true, name: true,
          },
        },
      },
    });
  }

  async findByUserId(userId: string): Promise<BonusTransaction[]> {
    return prisma.bonusTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        booking: {
          select: {
            id: true,
            startDateTime: true,
          },
        },
      },
    });
  }

  async sumPointsByUserAndType(
    userId: string,
    type: BonusType,
  ): Promise<number> {
    const result = await prisma.bonusTransaction.aggregate({
      where: {
        userId,
        type,
      },
      _sum: {
        points: true,
      },
    });

    return result._sum.points || 0;
  }

  async countByUserAndBooking(
    userId: string,
    bookingId: string,
  ): Promise<number> {
    return prisma.bonusTransaction.count({
      where: {
        userId,
        bookingId,
      },
    });
  }
}

