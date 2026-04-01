import { bookingsRepository } from '@/repositories/prisma/instances';
import { CancelUserBookingUseCase } from '../bookings/cancel-user-booking-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeCancelUserBookingUseCase() {
  const useCase = new CancelUserBookingUseCase(bookingsRepository);

  return traceUseCase('booking.cancel_user', useCase);
}
