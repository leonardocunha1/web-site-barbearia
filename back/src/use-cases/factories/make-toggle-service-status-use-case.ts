import { PrismaServicesRepository } from '@/repositories/prisma/prisma-services-repository';
import { ToggleServiceStatusUseCase } from '../services/toggle-service-status-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeToggleServiceStatusUseCase() {
  const servicesRepository = new PrismaServicesRepository();
  const useCase = new ToggleServiceStatusUseCase(servicesRepository);
  return traceUseCase('service.toggle_status', useCase);
}
