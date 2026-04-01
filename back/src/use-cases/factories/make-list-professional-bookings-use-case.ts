import { bookingsRepository } from '@/repositories/prisma/instances';
import { ListProfessionalBookingsUseCase } from '../bookings/list-professional-bookings-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeListProfessionalBookingsUseCase() {
  const useCase = new ListProfessionalBookingsUseCase(bookingsRepository);
  return traceUseCase('booking.list_by_professional', useCase);
}
