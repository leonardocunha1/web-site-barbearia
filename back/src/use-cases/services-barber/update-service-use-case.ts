import { ServicesRepository } from '@/repositories/services-repository';
import { Prisma, Service } from '@prisma/client';
import { ServiceNotFoundError } from '../errors/service-not-found-error';

interface UpdateServiceRequest {
  id: string;
  data: Prisma.ServiceUpdateInput;
}

interface UpdateServiceResponse {
  service: Service;
}

export class UpdateServiceUseCase {
  constructor(private servicesRepository: ServicesRepository) {}

  async execute({
    id,
    data,
  }: UpdateServiceRequest): Promise<UpdateServiceResponse> {
    const serviceExists = await this.servicesRepository.findById(id);
    if (!serviceExists) {
      throw new ServiceNotFoundError();
    }

    const service = await this.servicesRepository.update(id, data);
    return { service };
  }
}
