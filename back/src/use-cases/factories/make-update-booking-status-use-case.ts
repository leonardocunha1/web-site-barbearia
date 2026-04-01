import { bookingsRepository, userBonusRepository, bonusTransactionRepository } from '@/repositories/prisma/instances';
import { UpdateBookingStatusUseCase } from '../bookings/update-booking-status-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeUpdateBookingStatusUseCase() {
  const useCase = new UpdateBookingStatusUseCase(
    bookingsRepository,
    userBonusRepository,
    bonusTransactionRepository,
  );
  return traceUseCase('booking.update_status', useCase);
}
