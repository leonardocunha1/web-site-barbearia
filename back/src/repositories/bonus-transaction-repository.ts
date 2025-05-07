import { BonusTransaction, BonusType, Prisma } from '@prisma/client';

export interface BonusTransactionRepository {
  create(data: Prisma.BonusTransactionCreateInput): Promise<BonusTransaction>;

  findByBookingId(bookingId: string): Promise<BonusTransaction | null>;
  findByUserId(userId: string): Promise<BonusTransaction[]>;
  sumPointsByUserAndType(userId: string, type: BonusType): Promise<number>;
  countByUserAndBooking(userId: string, bookingId: string): Promise<number>;
}
