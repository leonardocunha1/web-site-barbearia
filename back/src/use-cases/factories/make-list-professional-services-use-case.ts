import { serviceProfessionalRepository, professionalsRepository } from '@/repositories/prisma/instances';
import { ListProfessionalServicesUseCase } from '../service-professional/list-professional-services-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeListProfessionalServicesUseCase() {
  const useCase = new ListProfessionalServicesUseCase(
    serviceProfessionalRepository,
    professionalsRepository,
  );

  return traceUseCase('service_professional.list', useCase);
}
