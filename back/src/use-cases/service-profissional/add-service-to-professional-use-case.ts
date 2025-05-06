import { ServicesRepository } from '@/repositories/services-repository';
import { ProfessionalsRepository } from '@/repositories/professionals-repository';
import { ServiceNotFoundError } from '../errors/service-not-found-error';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { ServiceProfessionalRepository } from '@/repositories/service-professional-repository';
import { ServiceAlreadyAddedError } from '../errors/service-already-added-error';
import { InvalidServicePriceDurationError } from '../errors/invalid-service-price-duration';

interface AddServiceToProfessionalRequest {
  serviceId: string;
  professionalId: string;
  preco: number;
  duracao: number;
}

export class AddServiceToProfessionalUseCase {
  constructor(
    private servicesRepository: ServicesRepository,
    private professionalsRepository: ProfessionalsRepository,
    private serviceProfessionalRepository: ServiceProfessionalRepository,
  ) {}

  async execute({
    serviceId,
    professionalId,
    preco,
    duracao,
  }: AddServiceToProfessionalRequest): Promise<void> {
    const serviceExists = await this.servicesRepository.findById(serviceId);
    if (!serviceExists) {
      throw new ServiceNotFoundError();
    }

    const professionalExists =
      await this.professionalsRepository.findById(professionalId);
    if (!professionalExists) {
      throw new ProfessionalNotFoundError();
    }

    const alreadyAdded =
      await this.serviceProfessionalRepository.findByServiceAndProfessional(
        serviceId,
        professionalId,
      );

    if (alreadyAdded) {
      throw new ServiceAlreadyAddedError();
    }

    if (preco <= 0) {
      throw new InvalidServicePriceDurationError();
    }

    if (duracao <= 0) {
      throw new InvalidServicePriceDurationError();
    }

    await this.serviceProfessionalRepository.create({
      service: { connect: { id: serviceId } },
      professional: { connect: { id: professionalId } },
      preco,
      duracao,
    });
  }
}
