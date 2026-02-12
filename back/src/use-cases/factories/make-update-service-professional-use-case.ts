import { PrismaServiceProfessionalRepository } from '@/repositories/prisma/prisma-service-professional-repository';
import { UpdateProfessionalServicesUseCase } from '../service-professional/update-professional-services-use-case';
import { UpdateServiceProfessionalUseCase } from '../service-professional/update-service-professional-use-case';

export function makeUpdateProfessionalServicesUseCase() {
  const serviceProfessionalRepository = new PrismaServiceProfessionalRepository();

  return new UpdateProfessionalServicesUseCase(serviceProfessionalRepository);
}

export function makeUpdateServiceProfessionalUseCase() {
  const serviceProfessionalRepository = new PrismaServiceProfessionalRepository();

  return new UpdateServiceProfessionalUseCase(serviceProfessionalRepository);
}
