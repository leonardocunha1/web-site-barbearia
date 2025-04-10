import { PrismaServicesRepository } from '@/repositories/prisma/prisma-services-repository';
import { UpdateServiceUseCase } from '@/use-cases/update-service';

export function makeUpdateServiceUseCase() {
  const servicesRepository = new PrismaServicesRepository();
  return new UpdateServiceUseCase(servicesRepository);
}
