import { PrismaBusinessHoursRepository } from '@/repositories/prisma/prisma-business-hours-repository';
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { ListBusinessHoursUseCase } from '../business-hours/list-business-hours-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeListBusinessHoursUseCase() {
  const businessHoursRepository = new PrismaBusinessHoursRepository();
  const professionalsRepository = new PrismaProfessionalsRepository();

  const useCase = new ListBusinessHoursUseCase(businessHoursRepository, professionalsRepository);

  return traceUseCase('business_hours.list', useCase);
}
