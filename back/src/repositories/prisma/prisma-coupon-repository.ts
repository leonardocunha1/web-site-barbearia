import { Coupon, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { CouponFilters, ICouponRepository } from '@/repositories/coupon-repository';
import { CouponSortField, CouponSortOrder } from '@/schemas/coupon';

export class PrismaCouponRepository implements ICouponRepository {
  async findByCode(code: string) {
    return prisma.coupon.findUnique({
      where: { code },
      include: { redemptions: true },
    });
  }

  async registerRedemption(data: {
    couponId: string;
    userId: string;
    bookingId: string;
    discount: number;
  }) {
    await prisma.$transaction([
      prisma.couponRedemption.create({
        data: {
          couponId: data.couponId,
          userId: data.userId,
          bookingId: data.bookingId,
          discount: data.discount,
        },
      }),
      prisma.coupon.update({
        where: { id: data.couponId },
        data: { uses: { increment: 1 } },
      }),
    ]);
  }

  async incrementUses(couponId: string) {
    await prisma.coupon.update({
      where: { id: couponId },
      data: { uses: { increment: 1 } },
    });
  }

  async findById(id: string) {
    return prisma.coupon.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.CouponCreateInput) {
    return prisma.coupon.create({
      data,
    });
  }

  async update(id: string, data: Prisma.CouponUpdateInput) {
    return prisma.coupon.update({
      where: { id },
      data,
    });
  }

  async listValidCoupons(professionalId: string, serviceIds: string[], currentDate: Date) {
    return prisma.coupon.findMany({
      where: {
        active: true,
        startDate: { lte: currentDate },
        AND: [
          {
            OR: [{ endDate: null }, { endDate: { gte: currentDate } }],
          },
          {
            OR: [{ maxUses: null }, { maxUses: { gt: 0 }, uses: { lt: 99999 } }],
          },
          {
            OR: [
              { scope: 'GLOBAL' },
              { scope: 'PROFESSIONAL', professionalId },
              { scope: 'SERVICE', serviceId: { in: serviceIds } },
            ],
          },
        ],
      },
    });
  }

  async findMany({
    page,
    limit,
    sort = [],
    filters = {},
  }: {
    page: number;
    limit: number;
    sort?: { field: CouponSortField; order: CouponSortOrder }[];
    filters?: CouponFilters;
  }): Promise<Coupon[]> {
    const orderBy = sort.map(({ field, order }) => ({ [field]: order }));

    return prisma.coupon.findMany({
      skip: Math.max(0, (page - 1) * limit),
      take: limit,
      orderBy,
      where: this.buildWhereClause(filters),
    });
  }

  async count(filters: CouponFilters = {}): Promise<number> {
    return prisma.coupon.count({
      where: this.buildWhereClause(filters),
    });
  }

  private buildWhereClause(filters: CouponFilters = {}): Prisma.CouponWhereInput {
    return {
      ...(filters.code && {
        code: { contains: filters.code, mode: 'insensitive' },
      }),
      ...(filters.type && { type: filters.type }),
      ...(filters.scope && { scope: filters.scope }),
      ...(filters.active !== undefined && { active: filters.active }),
      ...(filters.startDate && { startDate: { gte: filters.startDate } }),
      ...(filters.endDate && { endDate: { lte: filters.endDate } }),
      ...(filters.professionalId && { professionalId: filters.professionalId }),
      ...(filters.serviceId && { serviceId: filters.serviceId }),
    };
  }

  async delete(id: string): Promise<void> {
    await prisma.coupon.delete({
      where: {
        id,
      },
    });
  }
}
