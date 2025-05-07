import { BonusType, Prisma, UserBonus } from '@prisma/client';

export interface UserBonusRepository {
  upsert(data: Prisma.UserBonusUpdateInput): Promise<void>;

  findByUserIdAndType(
    userId: string,
    type: BonusType,
  ): Promise<UserBonus | null>;

  getPointsByType(
    userId: string,
    type: 'BOOKING_POINTS' | 'LOYALTY',
  ): Promise<number | null>;

  getValidPointsByType(
    userId: string,
    type: 'BOOKING_POINTS' | 'LOYALTY',
    currentDate: Date,
  ): Promise<number>;

  getValidPointsWithExpiration(
    userId: string,
    type: 'BOOKING_POINTS' | 'LOYALTY',
    currentDate: Date,
  ): Promise<{ points: number; expiresAt: Date | null }>;

  consumePoints(userId: string, quantity: number): Promise<void>;
}
