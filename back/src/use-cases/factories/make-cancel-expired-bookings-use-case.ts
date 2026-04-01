import { bookingsRepository } from '@/repositories/prisma/instances';
import { CancelExpiredBookingsUseCase } from '../bookings/cancel-expired-bookings-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeCancelExpiredBookingsUseCase() {
  const useCase = new CancelExpiredBookingsUseCase(bookingsRepository);
  return traceUseCase('booking.cancel_expired', useCase);
}
