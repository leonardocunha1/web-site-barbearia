import { PrismaServicesRepository } from '@/repositories/prisma/prisma-services-repository';
import { ToggleServiceStatusUseCase } from '../services/toggle-service-status-use-case';

export function makeToggleServiceStatusUseCase() {
  const servicesRepository = new PrismaServicesRepository();
  return new ToggleServiceStatusUseCase(servicesRepository);
}
