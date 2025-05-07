import { BonusRedemption, Prisma } from '@prisma/client';

export interface BonusRedemptionRepository {
  create(data: Prisma.BonusRedemptionCreateInput): Promise<BonusRedemption>;
}
