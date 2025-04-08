import { PrismaServicesRepository } from '@/repositories/prisma/prisma-services-repository';
import { CreateServiceUseCase } from '../create-service-use-case';

export function makeCreateServiceUseCase() {
  const servicesRepository = new PrismaServicesRepository();
  const createServiceUseCase = new CreateServiceUseCase(servicesRepository);

  return createServiceUseCase;
}
