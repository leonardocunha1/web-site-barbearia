import { businessHoursRepository, professionalsRepository } from '@/repositories/prisma/instances';
import { ListBusinessHoursUseCase } from '../business-hours/list-business-hours-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeListBusinessHoursUseCase() {
  const useCase = new ListBusinessHoursUseCase(businessHoursRepository, professionalsRepository);

  return traceUseCase('business_hours.list', useCase);
}
