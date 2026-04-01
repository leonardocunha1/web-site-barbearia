import { servicesRepository } from '@/repositories/prisma/instances';
import { CreateServiceUseCase } from '../services/create-service-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeCreateServiceUseCase() {
  const createServiceUseCase = new CreateServiceUseCase(servicesRepository);

  return traceUseCase('service.create', createServiceUseCase);
}
