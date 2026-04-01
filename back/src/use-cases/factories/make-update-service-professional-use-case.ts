import { serviceProfessionalRepository } from '@/repositories/prisma/instances';
import { UpdateProfessionalServicesUseCase } from '../service-professional/update-professional-services-use-case';
import { UpdateServiceProfessionalUseCase } from '../service-professional/update-service-professional-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeUpdateProfessionalServicesUseCase() {
  const useCase = new UpdateProfessionalServicesUseCase(serviceProfessionalRepository);
  return traceUseCase('service_professional.bulk_update', useCase);
}

export function makeUpdateServiceProfessionalUseCase() {
  const useCase = new UpdateServiceProfessionalUseCase(serviceProfessionalRepository);
  return traceUseCase('service_professional.update', useCase);
}
