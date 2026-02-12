import { BonusRedemption, Prisma } from '@prisma/client';

export interface IBonusRedemptionRepository {
  create(data: Prisma.BonusRedemptionCreateInput): Promise<BonusRedemption>;
}
