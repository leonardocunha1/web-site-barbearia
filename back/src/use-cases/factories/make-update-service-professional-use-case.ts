import { PrismaServiceProfessionalRepository } from '@/repositories/prisma/prisma-service-professional-repository';
import { UpdateServiceProfessionalUseCase } from '../service-profissional/update-service-professional-use-case';

export function makeUpdateServiceProfessionalUseCase() {
  const serviceProfessionalRepository =
    new PrismaServiceProfessionalRepository();

  return new UpdateServiceProfessionalUseCase(serviceProfessionalRepository);
}
