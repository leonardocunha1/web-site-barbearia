import { PrismaServicesRepository } from '@/repositories/prisma/prisma-services-repository';
import { GetServiceUseCase } from '../get-service-use-case';

export function makeGetServiceUseCase() {
  const servicesRepository = new PrismaServicesRepository();
  return new GetServiceUseCase(servicesRepository);
}
