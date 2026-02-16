import { PrismaServiceProfessionalRepository } from '@/repositories/prisma/prisma-service-professional-repository';
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { ListProfessionalServicesUseCase } from '../service-professional/list-professional-services-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeListProfessionalServicesUseCase() {
  const serviceProfessionalRepository = new PrismaServiceProfessionalRepository();
  const professionalsRepository = new PrismaProfessionalsRepository();

  const useCase = new ListProfessionalServicesUseCase(
    serviceProfessionalRepository,
    professionalsRepository,
  );

  return traceUseCase('service_professional.list', useCase);
}
