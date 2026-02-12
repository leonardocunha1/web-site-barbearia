import { PrismaServicesRepository } from '@/repositories/prisma/prisma-services-repository';
import { DeleteServiceUseCase } from '../services/delete-service-use-case';

export function makeDeleteServiceUseCase() {
  const servicesRepository = new PrismaServicesRepository();
  return new DeleteServiceUseCase(servicesRepository);
}
