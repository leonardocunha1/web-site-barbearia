import { ServicesRepository } from '@/repositories/services-repository';
import { ServiceNotFoundError } from '../errors/service-not-found-error';
import { ServiceDTO } from '@/dtos/service-dto';

interface GetServiceRequest {
  id: string;
}

interface GetServiceResponse {
  service: ServiceDTO;
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
