import { PrismaServiceProfessionalRepository } from '@/repositories/prisma/prisma-service-professional-repository';
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { ListProfessionalServicesUseCase } from '@/use-cases/list-professional-services';

export function makeListProfessionalServicesUseCase() {
  const serviceProfessionalRepository =
    new PrismaServiceProfessionalRepository();
  const professionalsRepository = new PrismaProfessionalsRepository();

  return new ListProfessionalServicesUseCase(
    serviceProfessionalRepository,
    professionalsRepository,
  );
}
