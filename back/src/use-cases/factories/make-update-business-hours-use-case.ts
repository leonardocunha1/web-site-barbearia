import { businessHoursRepository, professionalsRepository } from '@/repositories/prisma/instances';
import { UpdateBusinessHoursUseCase } from '../business-hours/update-business-hours-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeUpdateBusinessHoursUseCase() {
  const useCase = new UpdateBusinessHoursUseCase(businessHoursRepository, professionalsRepository);

  return traceUseCase('business_hours.update', useCase);
}
