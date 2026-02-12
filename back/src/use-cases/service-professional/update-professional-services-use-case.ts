import { IServiceProfessionalRepository } from '@/repositories/service-professional-repository';
import { InvalidServicePriceDurationError } from '../errors/invalid-service-price-duration';

interface ServiceUpdate {
  serviceId: string;
  price: number;
  duration: number;
  linked: boolean;
}

interface UpdateProfessionalServicesRequest {
  professionalId: string;
  services: ServiceUpdate[];
}

export class UpdateProfessionalServicesUseCase {
  constructor(private serviceProfessionalRepository: IServiceProfessionalRepository) {}

  async execute({ professionalId, services }: UpdateProfessionalServicesRequest): Promise<void> {
    for (const { serviceId, price, duration, linked } of services) {
      const existing = await this.serviceProfessionalRepository.findByServiceAndProfessional(
        serviceId,
        professionalId,
      );

      if (linked) {
        if (price <= 0 || duration <= 0) {
          throw new InvalidServicePriceDurationError();
        }

        if (existing) {
          await this.serviceProfessionalRepository.updateByServiceAndProfessional({
            serviceId,
            professionalId,
            price,
            duration,
          });
        } else {
          await this.serviceProfessionalRepository.create({
            service: { connect: { id: serviceId } },
            professional: { connect: { id: professionalId } },
            price,
            duration,
          });
        }
      } else {
        if (existing) {
          await this.serviceProfessionalRepository.deleteByServiceAndProfessional(
            serviceId,
            professionalId,
          );
        }
      }
    }
  }
}
