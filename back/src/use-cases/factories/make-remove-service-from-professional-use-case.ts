import { PrismaServiceProfessionalRepository } from '@/repositories/prisma/prisma-service-professional-repository';
import { PrismaBookingsRepository } from '@/repositories/prisma/prisma-bookings-repository';
import { RemoveServiceFromProfessionalUseCase } from '../service-profissional/remove-service-from-professional-use-case';

export function makeRemoveServiceFromProfessionalUseCase() {
  const serviceProfessionalRepository =
    new PrismaServiceProfessionalRepository();
  const bookingsRepository = new PrismaBookingsRepository();

  return new RemoveServiceFromProfessionalUseCase(
    serviceProfessionalRepository,
    bookingsRepository,
  );
}
