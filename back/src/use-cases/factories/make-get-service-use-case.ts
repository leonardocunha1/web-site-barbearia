import { servicesRepository } from '@/repositories/prisma/instances';
import { GetServiceUseCase } from '../services/get-service-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeGetServiceUseCase() {
  const useCase = new GetServiceUseCase(servicesRepository);
  return traceUseCase('service.get', useCase);
}
