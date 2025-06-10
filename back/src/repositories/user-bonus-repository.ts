import { BonusType, Prisma, UserBonus } from '@prisma/client';

export interface UserBonusRepository {
  upsert(data: Prisma.UserBonusUpdateInput): Promise<void>;

  findByUserIdAndType(
    userId: string,
    type: BonusType,
  ): Promise<UserBonus | null>;

  getPointsByType(userId: string, type: BonusType): Promise<number | null>;

  getValidPointsByType(
    userId: string,
    type: BonusType,
    currentDate: Date,
  ): Promise<number>;

  getValidPointsWithExpiration(
    userId: string,
    type: BonusType,
    currentDate: Date,
  ): Promise<{ points: number; expiresAt?: Date }>;

  consumePoints(userId: string, points: number, type: BonusType): Promise<void>;
}
