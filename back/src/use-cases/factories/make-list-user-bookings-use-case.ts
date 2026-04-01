import { bookingsRepository } from '@/repositories/prisma/instances';
import { ListBookingsUseCase } from '../bookings/list-user-bookings-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeListUserBookingsUseCase() {
  const listUserBookingsUseCase = new ListBookingsUseCase(bookingsRepository);

  return traceUseCase('booking.list_by_user', listUserBookingsUseCase);
}
