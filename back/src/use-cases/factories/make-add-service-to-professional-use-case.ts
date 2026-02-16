import { PrismaServicesRepository } from '@/repositories/prisma/prisma-services-repository';
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { PrismaServiceProfessionalRepository } from '@/repositories/prisma/prisma-service-professional-repository';
import { AddServiceToProfessionalUseCase } from '../service-professional/add-service-to-professional-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeAddServiceToProfessionalUseCase() {
  const servicesRepository = new PrismaServicesRepository();
  const professionalsRepository = new PrismaProfessionalsRepository();
  const serviceProfessionalRepository = new PrismaServiceProfessionalRepository();

  const useCase = new AddServiceToProfessionalUseCase(
    servicesRepository,
    professionalsRepository,
    serviceProfessionalRepository,
  );

  return traceUseCase('service_professional.add', useCase);
}
