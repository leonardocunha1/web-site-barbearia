import { ServicesRepository } from '@/repositories/services-repository';
import { Service } from '@prisma/client';
import { ServiceNotFoundError } from '../errors/service-not-found-error';

interface ToggleServiceStatusRequest {
  id: string;
}

interface ToggleServiceStatusResponse {
  service: Service;
}

export class ToggleServiceStatusUseCase {
  constructor(private servicesRepository: ServicesRepository) {}

  async execute({
    id,
  }: ToggleServiceStatusRequest): Promise<ToggleServiceStatusResponse> {
    const serviceExists = await this.servicesRepository.findById(id);

    if (!serviceExists) {
      throw new ServiceNotFoundError();
    }

    const service = await this.servicesRepository.toggleStatus(
      id,
      !serviceExists.ativo,
    );

    return { service };
  }
}
