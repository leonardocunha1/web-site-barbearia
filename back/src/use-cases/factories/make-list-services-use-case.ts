import { PrismaServicesRepository } from '@/repositories/prisma/prisma-services-repository';
import { ListServicesUseCase } from '../list-services';

export function makeListServicesUseCase() {
  const servicesRepository = new PrismaServicesRepository();
  return new ListServicesUseCase(servicesRepository);
}
