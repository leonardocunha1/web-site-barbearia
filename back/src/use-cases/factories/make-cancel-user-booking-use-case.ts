import { PrismaBookingsRepository } from '@/repositories/prisma/prisma-bookings-repository';
import { CancelUserBookingUseCase } from '../bookings/cancel-user-booking-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeCancelUserBookingUseCase() {
  const bookingsRepository = new PrismaBookingsRepository();
  const useCase = new CancelUserBookingUseCase(bookingsRepository);

  return traceUseCase('booking.cancel_user', useCase);
}
