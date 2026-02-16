import { UpdateBusinessHoursUseCase } from '../business-hours/update-business-hours-use-case';
import { PrismaBusinessHoursRepository } from '@/repositories/prisma/prisma-business-hours-repository';
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeUpdateBusinessHoursUseCase() {
  const businessHoursRepository = new PrismaBusinessHoursRepository();
  const professionalsRepository = new PrismaProfessionalsRepository();

  const useCase = new UpdateBusinessHoursUseCase(businessHoursRepository, professionalsRepository);

  return traceUseCase('business_hours.update', useCase);
}
