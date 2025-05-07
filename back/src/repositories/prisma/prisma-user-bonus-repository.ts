import { prisma } from '@/lib/prisma';
import { UserBonusRepository } from '../user-bonus-repository';
import { BonusType } from '@prisma/client';

export class PrismaUserBonusRepository implements UserBonusRepository {
  async upsert(data: { userId: string; type: BonusType; points: number }) {
    const existingBonus = await prisma.userBonus.findUnique({
      where: {
        userId_type: {
          userId: data.userId,
          type: data.type,
        },
      },
    });

    const newExpiresAt = new Date();
    newExpiresAt.setMonth(newExpiresAt.getMonth() + 6); // define nova validade para 6 meses a partir de hoje

    if (
      !existingBonus ||
      (existingBonus.expiresAt && existingBonus.expiresAt < new Date())
    ) {
      // Sem registro anterior ou pontos expirados: sobrescreve com novos pontos
      await prisma.userBonus.upsert({
        where: {
          userId_type: {
            userId: data.userId,
            type: data.type,
          },
        },
        update: {
          points: data.points,
          expiresAt: newExpiresAt,
        },
        create: {
          userId: data.userId,
          type: data.type,
          points: data.points,
          expiresAt: newExpiresAt,
        },
      });
    } else {
      // Se os pontos existentes ainda são válidos, incrementa
      await prisma.userBonus.update({
        where: {
          userId_type: {
            userId: data.userId,
            type: data.type,
          },
        },
        data: {
          points: {
            increment: data.points,
          },
          expiresAt: newExpiresAt,
        },
      });
    }
  }

  async findByUserIdAndType(userId: string, type: BonusType) {
    return prisma.userBonus.findFirst({
      where: {
        userId,
        type,
      },
    });
  }

  async getPointsByType(
    userId: string,
    type: BonusType,
  ): Promise<number | null> {
    const userBonus = await prisma.userBonus.findUnique({
      where: {
        userId_type: {
          userId,
          type,
        },
      },
    });

    return userBonus?.points || null;
  }

  async getValidPointsByType(
    userId: string,
    type: 'BOOKING_POINTS' | 'LOYALTY',
    currentDate: Date,
  ): Promise<number> {
    const userBonus = await prisma.userBonus.findUnique({
      where: {
        userId_type: {
          userId,
          type,
        },
      },
    });

    if (!userBonus) return 0;

    // Verifica se os pontos estão expirados
    if (userBonus.expiresAt && userBonus.expiresAt < currentDate) {
      return 0; // Pontos expirados
    }

    return userBonus.points;
  }

  async getValidPointsWithExpiration(
    userId: string,
    type: 'BOOKING_POINTS' | 'LOYALTY',
    currentDate: Date,
  ): Promise<{ points: number; expiresAt: Date | null }> {
    const userBonus = await prisma.userBonus.findUnique({
      where: {
        userId_type: {
          userId,
          type,
        },
      },
    });

    if (!userBonus) return { points: 0, expiresAt: null };

    // Verifica se os pontos estão expirados
    if (userBonus.expiresAt && userBonus.expiresAt < currentDate) {
      return { points: 0, expiresAt: null };
    }

    return {
      points: userBonus.points,
      expiresAt: userBonus.expiresAt,
    };
  }

  async consumePoints(userId: string, quantity: number): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const updated = await tx.userBonus.updateMany({
        where: {
          userId,
          type: 'BOOKING_POINTS',
          points: {
            gte: quantity, // garante que só atualiza se houver pontos suficientes
          },
        },
        data: {
          points: {
            decrement: quantity,
          },
        },
      });

      if (updated.count === 0) {
        throw new Error('Pontos insuficientes ou não encontrados');
      }
    });
  }
}
