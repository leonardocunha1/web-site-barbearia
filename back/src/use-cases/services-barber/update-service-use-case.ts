import { ServicesRepository } from '@/repositories/services-repository';
import { Service } from '@prisma/client';
import { ServiceNotFoundError } from '../errors/service-not-found-error';

interface UpdateServiceRequest {
  id: string;
  data: {
    nome?: string;
    descricao?: string | null;
    precoPadrao?: number;
    duracao?: number;
    categoria?: string | null;
    ativo?: boolean;
    professionalId?: string | null;
  };
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
