import { ServicesRepository } from '@/repositories/services-repository';
import { Service } from '@prisma/client';
import { ServiceNotFoundError } from '../errors/service-not-found-error';

interface GetServiceRequest {
  id: string;
}

interface GetServiceResponse {
  service: Service;
}

export class GetServiceUseCase {
  constructor(private servicesRepository: ServicesRepository) {}

  async execute({ id }: GetServiceRequest): Promise<GetServiceResponse> {
    const service = await this.servicesRepository.findById(id);

    if (!service) {
      throw new ServiceNotFoundError();
    }

    return {
      service,
    };
  }
}
