import { serviceProfessionalRepository, bookingsRepository } from '@/repositories/prisma/instances';
import { RemoveServiceFromProfessionalUseCase } from '../service-professional/remove-service-from-professional-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeRemoveServiceFromProfessionalUseCase() {
  const useCase = new RemoveServiceFromProfessionalUseCase(
    serviceProfessionalRepository,
    bookingsRepository,
  );

  return traceUseCase('service_professional.remove', useCase);
}
