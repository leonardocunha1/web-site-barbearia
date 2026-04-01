import {
  servicesRepository,
  professionalsRepository,
  serviceProfessionalRepository,
} from '@/repositories/prisma/instances';
import { AddServiceToProfessionalUseCase } from '../service-professional/add-service-to-professional-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeAddServiceToProfessionalUseCase() {
  const useCase = new AddServiceToProfessionalUseCase(
    servicesRepository,
    professionalsRepository,
    serviceProfessionalRepository,
  );

  return traceUseCase('service_professional.add', useCase);
}
