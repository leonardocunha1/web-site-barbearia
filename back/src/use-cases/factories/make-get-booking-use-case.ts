import { bookingsRepository } from '@/repositories/prisma/instances';
import { GetBookingUseCase } from '../bookings/get-booking-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeGetBookingUseCase() {
  const useCase = new GetBookingUseCase(bookingsRepository);
  return traceUseCase('booking.get', useCase);
}
