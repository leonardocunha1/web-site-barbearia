import { PrismaServicesRepository } from '@/repositories/prisma/prisma-services-repository';
import { UpdateServiceUseCase } from '../services-barber/update-service-use-case';

export function makeUpdateServiceUseCase() {
  const servicesRepository = new PrismaServicesRepository();
  return new UpdateServiceUseCase(servicesRepository);
}
