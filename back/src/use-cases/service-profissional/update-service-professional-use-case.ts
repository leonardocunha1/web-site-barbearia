import { ServiceProfessionalRepository } from '@/repositories/service-professional-repository';
import { InvalidServicePriceDurationError } from '../errors/invalid-service-price-duration';

interface UpdateServiceProfessionalRequest {
  serviceId: string;
  professionalId: string;
  preco: number;
  duracao: number;
}

export class UpdateServiceProfessionalUseCase {
  constructor(
    private serviceProfessionalRepository: ServiceProfessionalRepository,
  ) {}

  async execute({
    serviceId,
    professionalId,
    preco,
    duracao,
  }: UpdateServiceProfessionalRequest): Promise<void> {
    if (preco <= 0 || duracao <= 0) {
      throw new InvalidServicePriceDurationError();
    }

    const existing =
      await this.serviceProfessionalRepository.findByServiceAndProfessional(
        serviceId,
        professionalId,
      );

    if (!existing) {
      throw new Error('Serviço não encontrado para esse profissional.');
    }

    await this.serviceProfessionalRepository.updateByServiceAndProfessional({
      serviceId,
      professionalId,
      preco,
      duracao,
    });
  }
}
