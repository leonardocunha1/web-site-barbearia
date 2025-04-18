import { PrismaServicesRepository } from '@/repositories/prisma/prisma-services-repository';
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { PrismaServiceProfessionalRepository } from '@/repositories/prisma/prisma-service-professional-repository';
import { AddServiceToProfessionalUseCase } from '../service-profissional/add-service-to-professional-use-case';

export function makeAddServiceToProfessionalUseCase() {
  const servicesRepository = new PrismaServicesRepository();
  const professionalsRepository = new PrismaProfessionalsRepository();
  const serviceProfessionalRepository =
    new PrismaServiceProfessionalRepository();

  return new AddServiceToProfessionalUseCase(
    servicesRepository,
    professionalsRepository,
    serviceProfessionalRepository,
  );
}
