import { servicesRepository } from '@/repositories/prisma/instances';
import { UpdateServiceUseCase } from '../services/update-service-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeUpdateServiceUseCase() {
  const useCase = new UpdateServiceUseCase(servicesRepository);
  return traceUseCase('service.update', useCase);
}
