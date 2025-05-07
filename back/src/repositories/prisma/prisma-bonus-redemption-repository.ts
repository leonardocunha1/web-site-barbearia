import { prisma } from '@/lib/prisma';
import { BonusRedemptionRepository } from '@/repositories/bonus-redemption-repository';
import { BonusRedemption, Prisma } from '@prisma/client';

export class PrismaBonusRedemptionRepository
  implements BonusRedemptionRepository
{
  async create(
    data: Prisma.BonusRedemptionCreateInput,
  ): Promise<BonusRedemption> {
    return prisma.bonusRedemption.create({
      data,
    });
  }
}
