import { prisma } from '@/lib/prisma';
import { IBonusRedemptionRepository } from '@/repositories/bonus-redemption-repository';
import { BonusRedemption, Prisma } from '@prisma/client';

export class PrismaBonusRedemptionRepository implements IBonusRedemptionRepository {
  async create(data: Prisma.BonusRedemptionCreateInput): Promise<BonusRedemption> {
    return prisma.bonusRedemption.create({
      data,
    });
  }
}
