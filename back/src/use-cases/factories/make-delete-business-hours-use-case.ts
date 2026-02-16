import { PrismaBusinessHoursRepository } from '@/repositories/prisma/prisma-business-hours-repository';
import { DeleteBusinessHoursUseCase } from '../business-hours/delete-business-hours-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeDeleteBusinessHoursUseCase() {
  const businessHoursRepository = new PrismaBusinessHoursRepository();
  const useCase = new DeleteBusinessHoursUseCase(businessHoursRepository);

  return traceUseCase('business_hours.delete', useCase);
}
