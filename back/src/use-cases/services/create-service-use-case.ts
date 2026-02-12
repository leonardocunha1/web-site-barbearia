import { IServicesRepository } from '@/repositories/services-repository';
import type { Service } from '@prisma/client';
import { ServiceAlreadyExistsError } from '../errors/service-already-exists-error';
interface CreateServiceResponse {
  service: Service;
}
interface CreateServiceRequest {
  name: string;
  description?: string;
  category?: string;
  active: boolean;
}

export class CreateServiceUseCase {
  constructor(private servicesRepository: IServicesRepository) {}

  async execute({
    name,
    description,
    category,
    active,
  }: CreateServiceRequest): Promise<CreateServiceResponse> {
    const existingService = await this.servicesRepository.findByName(name);
    if (existingService) {
      throw new ServiceAlreadyExistsError();
    }

    const service = await this.servicesRepository.create({
      name,
      description,
      category,
      active,
    });

    return { service };
  }
}
