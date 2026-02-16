import { PrismaServiceProfessionalRepository } from '@/repositories/prisma/prisma-service-professional-repository';
import { UpdateProfessionalServicesUseCase } from '../service-professional/update-professional-services-use-case';
import { UpdateServiceProfessionalUseCase } from '../service-professional/update-service-professional-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeUpdateProfessionalServicesUseCase() {
  const serviceProfessionalRepository = new PrismaServiceProfessionalRepository();

  const useCase = new UpdateProfessionalServicesUseCase(serviceProfessionalRepository);
  return traceUseCase('service_professional.bulk_update', useCase);
}

export function makeUpdateServiceProfessionalUseCase() {
  const serviceProfessionalRepository = new PrismaServiceProfessionalRepository();

  const useCase = new UpdateServiceProfessionalUseCase(serviceProfessionalRepository);
  return traceUseCase('service_professional.update', useCase);
}
