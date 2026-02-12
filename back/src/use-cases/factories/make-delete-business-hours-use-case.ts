import { PrismaBusinessHoursRepository } from '@/repositories/prisma/prisma-business-hours-repository';
import { DeleteBusinessHoursUseCase } from '../business-hours/delete-business-hours-use-case';

export function makeDeleteBusinessHoursUseCase() {
  const businessHoursRepository = new PrismaBusinessHoursRepository();
  const useCase = new DeleteBusinessHoursUseCase(businessHoursRepository);

  return useCase;
}


