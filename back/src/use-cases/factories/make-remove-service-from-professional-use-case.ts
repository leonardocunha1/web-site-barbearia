import { PrismaServiceProfessionalRepository } from '@/repositories/prisma/prisma-service-professional-repository';
import { PrismaBookingsRepository } from '@/repositories/prisma/prisma-bookings-repository';
import { RemoveServiceFromProfessionalUseCase } from '../service-professional/remove-service-from-professional-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeRemoveServiceFromProfessionalUseCase() {
  const serviceProfessionalRepository = new PrismaServiceProfessionalRepository();
  const bookingsRepository = new PrismaBookingsRepository();

  const useCase = new RemoveServiceFromProfessionalUseCase(
    serviceProfessionalRepository,
    bookingsRepository,
  );

  return traceUseCase('service_professional.remove', useCase);
}
