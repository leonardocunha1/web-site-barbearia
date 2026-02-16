import { PrismaBookingsRepository } from '@/repositories/prisma/prisma-bookings-repository';
import { GetProfessionalScheduleUseCase } from '../professional/get-schedule-use-case';
import { PrismaBusinessHoursRepository } from '@/repositories/prisma/prisma-business-hours-repository';
import { PrismaHolidaysRepository } from '@/repositories/prisma/prisma-holidays-repository';
import { PrismaServiceProfessionalRepository } from '@/repositories/prisma/prisma-service-professional-repository';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeGetProfessionalScheduleUseCase() {
  const bookingsRepository = new PrismaBookingsRepository();
  const businessHoursRepository = new PrismaBusinessHoursRepository();
  const holidaysRepository = new PrismaHolidaysRepository();
  const serviceProfessionalRepository = new PrismaServiceProfessionalRepository();

  const useCase = new GetProfessionalScheduleUseCase(
    bookingsRepository,
    businessHoursRepository,
    holidaysRepository,
    serviceProfessionalRepository,
  );

  return traceUseCase('professional.schedule.get', useCase);
}
