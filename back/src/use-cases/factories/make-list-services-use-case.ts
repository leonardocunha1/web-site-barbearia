import { servicesRepository, professionalsRepository } from '@/repositories/prisma/instances';
import { ListServicesUseCase } from '../services/list-services-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeListServicesUseCase() {
  const useCase = new ListServicesUseCase(servicesRepository, professionalsRepository);
  return traceUseCase('service.list', useCase);
}
