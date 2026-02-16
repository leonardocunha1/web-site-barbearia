import { PrismaServicesRepository } from '@/repositories/prisma/prisma-services-repository';
import { CreateServiceUseCase } from '../services/create-service-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeCreateServiceUseCase() {
  const servicesRepository = new PrismaServicesRepository();
  const createServiceUseCase = new CreateServiceUseCase(servicesRepository);

  return traceUseCase('service.create', createServiceUseCase);
}
