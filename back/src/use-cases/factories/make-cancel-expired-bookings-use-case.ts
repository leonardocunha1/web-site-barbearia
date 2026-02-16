import { PrismaBookingsRepository } from '@/repositories/prisma/prisma-bookings-repository';
import { CancelExpiredBookingsUseCase } from '../bookings/cancel-expired-bookings-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeCancelExpiredBookingsUseCase() {
  const bookingsRepository = new PrismaBookingsRepository();
  const useCase = new CancelExpiredBookingsUseCase(bookingsRepository);
  return traceUseCase('booking.cancel_expired', useCase);
}
