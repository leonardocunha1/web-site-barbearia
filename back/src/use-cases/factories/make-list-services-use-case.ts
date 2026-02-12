import { PrismaServicesRepository } from '@/repositories/prisma/prisma-services-repository';
import { ListServicesUseCase } from '../services/list-services-use-case';
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';

export function makeListServicesUseCase() {
  const servicesRepository = new PrismaServicesRepository();
  const professionalsRepository = new PrismaProfessionalsRepository();
  return new ListServicesUseCase(servicesRepository, professionalsRepository);
}

