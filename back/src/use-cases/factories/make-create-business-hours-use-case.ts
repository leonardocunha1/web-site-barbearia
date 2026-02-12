import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { PrismaBusinessHoursRepository } from '@/repositories/prisma/prisma-business-hours-repository';
import { CreateBusinessHoursUseCase } from '../business-hours/create-business-hours-use-case';

export function makeCreateBusinessHoursUseCase() {
  const professionalsRepository = new PrismaProfessionalsRepository();
  const businessHoursRepository = new PrismaBusinessHoursRepository();
  const useCase = new CreateBusinessHoursUseCase(businessHoursRepository, professionalsRepository);

  return useCase;
}
