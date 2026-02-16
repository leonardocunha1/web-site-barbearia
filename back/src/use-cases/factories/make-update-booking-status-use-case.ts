import { PrismaBookingsRepository } from '@/repositories/prisma/prisma-bookings-repository';
import { UpdateBookingStatusUseCase } from '../bookings/update-booking-status-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeUpdateBookingStatusUseCase() {
  const bookingsRepository = new PrismaBookingsRepository();
  const useCase = new UpdateBookingStatusUseCase(bookingsRepository);
  return traceUseCase('booking.update_status', useCase);
}
