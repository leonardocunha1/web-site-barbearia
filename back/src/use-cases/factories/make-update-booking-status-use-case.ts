import { PrismaBookingsRepository } from '@/repositories/prisma/prisma-bookings-repository';
import { PrismaUserBonusRepository } from '@/repositories/prisma/prisma-user-bonus-repository';
import { PrismaBonusTransactionRepository } from '@/repositories/prisma/prisma-bonus-transaction-repository';
import { UpdateBookingStatusUseCase } from '../bookings/update-booking-status-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeUpdateBookingStatusUseCase() {
  const bookingsRepository = new PrismaBookingsRepository();
  const userBonusRepository = new PrismaUserBonusRepository();
  const bonusTransactionRepository = new PrismaBonusTransactionRepository();
  const useCase = new UpdateBookingStatusUseCase(
    bookingsRepository,
    userBonusRepository,
    bonusTransactionRepository,
  );
  return traceUseCase('booking.update_status', useCase);
}
