import { servicesRepository } from '@/repositories/prisma/instances';
import { ToggleServiceStatusUseCase } from '../services/toggle-service-status-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeToggleServiceStatusUseCase() {
  const useCase = new ToggleServiceStatusUseCase(servicesRepository);
  return traceUseCase('service.toggle_status', useCase);
}
