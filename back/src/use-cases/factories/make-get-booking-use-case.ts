import { PrismaBookingsRepository } from '@/repositories/prisma/prisma-bookings-repository';
import { GetBookingUseCase } from '../bookings/get-booking-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeGetBookingUseCase() {
  const bookingsRepository = new PrismaBookingsRepository();
  const useCase = new GetBookingUseCase(bookingsRepository);
  return traceUseCase('booking.get', useCase);
}
