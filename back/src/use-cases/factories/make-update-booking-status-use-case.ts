import { PrismaBookingsRepository } from '@/repositories/prisma/prisma-bookings-repository';
import { UpdateBookingStatusUseCase } from '../bookings/update-booking-status-use-case';

export function makeUpdateBookingStatusUseCase() {
  const bookingsRepository = new PrismaBookingsRepository();
  return new UpdateBookingStatusUseCase(bookingsRepository);
}
