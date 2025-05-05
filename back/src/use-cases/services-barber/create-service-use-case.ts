import { ServicesRepository } from '@/repositories/services-repository';
import type { Service } from '@prisma/client';
import { ServiceAlreadyExistsError } from '../errors/service-already-exists-error';

interface CreateServiceRequest {
  nome: string;
  descricao?: string;
  categoria?: string;
}

interface CreateServiceResponse {
  service: Service;
}

export class CreateServiceUseCase {
  constructor(private servicesRepository: ServicesRepository) {}

  async execute({
    nome,
    descricao,
    categoria,
  }: CreateServiceRequest): Promise<CreateServiceResponse> {
    const existingService = await this.servicesRepository.findByName(nome);
    if (existingService) {
      throw new ServiceAlreadyExistsError();
    }

    const service = await this.servicesRepository.create({
      nome,
      descricao,
      categoria,
    });

    return { service };
  }
}
