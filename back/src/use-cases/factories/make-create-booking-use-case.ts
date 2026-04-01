import {
  bookingsRepository,
  usersRepository,
  professionalsRepository,
  serviceProfessionalRepository,
  userBonusRepository,
  couponRepository,
} from '@/repositories/prisma/instances';
import { CreateBookingUseCase } from '../bookings/create-booking-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeCreateBookingUseCase() {
  const useCase = new CreateBookingUseCase(
    bookingsRepository,
    usersRepository,
    professionalsRepository,
    serviceProfessionalRepository,
    userBonusRepository,
    couponRepository,
  );

  return traceUseCase('booking.create', useCase);
}
