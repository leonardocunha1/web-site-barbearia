import { professionalsRepository, businessHoursRepository } from '@/repositories/prisma/instances';
import { CreateBusinessHoursUseCase } from '../business-hours/create-business-hours-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeCreateBusinessHoursUseCase() {
  const useCase = new CreateBusinessHoursUseCase(businessHoursRepository, professionalsRepository);

  return traceUseCase('business_hours.create', useCase);
}
