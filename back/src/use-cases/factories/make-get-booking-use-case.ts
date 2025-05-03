import { PrismaBookingsRepository } from '@/repositories/prisma/prisma-bookings-repository';
import { GetBookingUseCase } from '../bookings/get-booking-use-case';

export function makeGetBookingUseCase() {
  const bookingsRepository = new PrismaBookingsRepository();
  return new GetBookingUseCase(bookingsRepository);
}
