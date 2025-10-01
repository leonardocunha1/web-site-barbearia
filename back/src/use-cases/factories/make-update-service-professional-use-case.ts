import { PrismaServiceProfessionalRepository } from '@/repositories/prisma/prisma-service-professional-repository';
import { UpdateProfessionalServicesUseCase } from '../service-profissional/update-service-professional-use-case';

export function makeUpdateProfessionalServicesUseCase() {
  const serviceProfessionalRepository =
    new PrismaServiceProfessionalRepository();

  return new UpdateProfessionalServicesUseCase(serviceProfessionalRepository);
}
