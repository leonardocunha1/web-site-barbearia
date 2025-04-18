import { PrismaServicesRepository } from '@/repositories/prisma/prisma-services-repository';
import { ListServicesUseCase } from '../services-barber/list-services';

export function makeListServicesUseCase() {
  const servicesRepository = new PrismaServicesRepository();
  return new ListServicesUseCase(servicesRepository);
}
