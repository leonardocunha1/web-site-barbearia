import { PrismaBookingsRepository } from '@/repositories/prisma/prisma-bookings-repository';
import { ListBookingsUseCase } from '../bookings/list-user-bookings-use-case';

export function makeListUserBookingsUseCase() {
  const bookingsRepository = new PrismaBookingsRepository();
  const listUserBookingsUseCase = new ListBookingsUseCase(bookingsRepository);

  return listUserBookingsUseCase;
}
