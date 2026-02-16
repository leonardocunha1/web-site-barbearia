import { PrismaServicesRepository } from '@/repositories/prisma/prisma-services-repository';
import { UpdateServiceUseCase } from '../services/update-service-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeUpdateServiceUseCase() {
  const servicesRepository = new PrismaServicesRepository();
  const useCase = new UpdateServiceUseCase(servicesRepository);
  return traceUseCase('service.update', useCase);
}
