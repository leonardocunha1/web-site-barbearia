import { ServiceProfessionalRepository } from '@/repositories/service-professional-repository';
import { BookingsRepository } from '@/repositories/bookings-repository';
import { ServiceProfessionalNotFoundError } from '../errors/service-professional-not-found-error';
import { ServiceWithBookingsError } from '../errors/service-with-bookings-error';

interface RemoveServiceFromProfessionalRequest {
  serviceId: string;
  professionalId: string;
}

export class RemoveServiceFromProfessionalUseCase {
  constructor(
    private serviceProfessionalRepository: ServiceProfessionalRepository,
    private bookingsRepository: BookingsRepository,
  ) {}

  async execute({
    serviceId,
    professionalId,
  }: RemoveServiceFromProfessionalRequest): Promise<void> {
    const relationExists =
      await this.serviceProfessionalRepository.findByServiceAndProfessional(
        serviceId,
        professionalId,
      );

    if (!relationExists) {
      throw new ServiceProfessionalNotFoundError();
    }

    const hasBookings =
      await this.bookingsRepository.countActiveByServiceAndProfessional(
        serviceId,
        professionalId,
      );

    if (hasBookings > 0) {
      throw new ServiceWithBookingsError();
    }

    await this.serviceProfessionalRepository.delete(relationExists.id);
  }
}
