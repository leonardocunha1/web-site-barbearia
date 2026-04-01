import { bookingsRepository, businessHoursRepository, holidaysRepository, serviceProfessionalRepository } from '@/repositories/prisma/instances';
import { GetProfessionalScheduleUseCase } from '../professional/get-schedule-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeGetProfessionalScheduleUseCase() {
  const useCase = new GetProfessionalScheduleUseCase(
    bookingsRepository,
    businessHoursRepository,
    holidaysRepository,
    serviceProfessionalRepository,
  );

  return traceUseCase('professional.schedule.get', useCase);
}
