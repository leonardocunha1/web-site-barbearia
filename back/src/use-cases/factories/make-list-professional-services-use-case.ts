import { PrismaServiceProfessionalRepository } from '@/repositories/prisma/prisma-service-professional-repository';
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { ListProfessionalServicesUseCase } from '../service-professional/list-professional-services-use-case';

export function makeListProfessionalServicesUseCase() {
  const serviceProfessionalRepository =
    new PrismaServiceProfessionalRepository();
  const professionalsRepository = new PrismaProfessionalsRepository();

  return new ListProfessionalServicesUseCase(
    serviceProfessionalRepository,
    professionalsRepository,
  );
}

