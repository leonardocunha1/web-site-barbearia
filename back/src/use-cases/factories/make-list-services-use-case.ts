import { PrismaServicesRepository } from '@/repositories/prisma/prisma-services-repository';
import { ListServicesUseCase } from '../services/list-services-use-case';
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeListServicesUseCase() {
  const servicesRepository = new PrismaServicesRepository();
  const professionalsRepository = new PrismaProfessionalsRepository();
  const useCase = new ListServicesUseCase(servicesRepository, professionalsRepository);
  return traceUseCase('service.list', useCase);
}
