import { businessHoursRepository } from '@/repositories/prisma/instances';
import { DeleteBusinessHoursUseCase } from '../business-hours/delete-business-hours-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeDeleteBusinessHoursUseCase() {
  const useCase = new DeleteBusinessHoursUseCase(businessHoursRepository);

  return traceUseCase('business_hours.delete', useCase);
}
