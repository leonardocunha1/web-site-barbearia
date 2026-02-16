import { PrismaServicesRepository } from '@/repositories/prisma/prisma-services-repository';
import { GetServiceUseCase } from '../services/get-service-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeGetServiceUseCase() {
  const servicesRepository = new PrismaServicesRepository();
  const useCase = new GetServiceUseCase(servicesRepository);
  return traceUseCase('service.get', useCase);
}
