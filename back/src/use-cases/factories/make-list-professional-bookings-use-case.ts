import { PrismaBookingsRepository } from '@/repositories/prisma/prisma-bookings-repository';
import { ListProfessionalBookingsUseCase } from '../bookings/list-professional-bookings';

export function makeListProfessionalBookingsUseCase() {
  const bookingsRepository = new PrismaBookingsRepository();
  return new ListProfessionalBookingsUseCase(bookingsRepository);
}
