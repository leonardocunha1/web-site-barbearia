import { PrismaBookingsRepository } from '@/repositories/prisma/prisma-bookings-repository';
import { GetProfessionalScheduleUseCase } from '../professional/get-schedule-use-case';
import { PrismaBusinessHoursRepository } from '@/repositories/prisma/prisma-business-hours-repository';
import { PrismaHolidaysRepository } from '@/repositories/prisma/prisma-holidays-repository';

export function makeGetProfessionalScheduleUseCase() {
  const bookingsRepository = new PrismaBookingsRepository();
  const businessHoursRepository = new PrismaBusinessHoursRepository();
  const holidaysRepository = new PrismaHolidaysRepository();

  return new GetProfessionalScheduleUseCase(
    bookingsRepository,
    businessHoursRepository,
    holidaysRepository,
  );
}
