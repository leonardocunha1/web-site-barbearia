import { IServiceProfessionalRepository } from '@/repositories/service-professional-repository';
import { InvalidServicePriceDurationError } from '../errors/invalid-service-price-duration';
import { SCHEDULE_SLOT_MINUTES } from '@/consts/const';

interface UpdateServiceProfessionalRequest {
  serviceId: string;
  professionalId: string;
  price: number;
  duration: number;
}

export class UpdateServiceProfessionalUseCase {
  constructor(private serviceProfessionalRepository: IServiceProfessionalRepository) {}

  async execute({
    serviceId,
    professionalId,
    price,
    duration,
  }: UpdateServiceProfessionalRequest): Promise<void> {
    // Validate price and duration
    if (price <= 0 || duration <= 0) {
      throw new InvalidServicePriceDurationError();
    }

    // Validate that duration is a multiple of the schedule slot size
    if (duration % SCHEDULE_SLOT_MINUTES !== 0) {
      throw new InvalidServicePriceDurationError();
    }

    // Check if service exists for professional
    const existing = await this.serviceProfessionalRepository.findByServiceAndProfessional(
      serviceId,
      professionalId,
    );

    if (!existing) {
      throw new Error('Serviço não encontrado para esse profissional.');
    }

    // Update the service-professional relationship
    await this.serviceProfessionalRepository.updateByServiceAndProfessional({
      serviceId,
      professionalId,
      price,
      duration,
    });
  }
}
