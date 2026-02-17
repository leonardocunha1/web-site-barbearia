import { IServicesRepository } from '@/repositories/services-repository';
import type { Service, ServiceType } from '@prisma/client';
import { ServiceAlreadyExistsError } from '../errors/service-already-exists-error';
interface CreateServiceResponse {
  service: Service;
}
interface CreateServiceRequest {
  name: string;
  type: ServiceType;
  description?: string;
  category?: string;
  active: boolean;
}

export class CreateServiceUseCase {
  constructor(private servicesRepository: IServicesRepository) {}

  async execute({
    name,
    type,
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
      type,
      description,
      category,
      active,
    });

    return { service };
  }
}
