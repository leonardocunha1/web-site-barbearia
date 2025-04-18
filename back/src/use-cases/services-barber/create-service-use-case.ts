import { ServicesRepository } from '@/repositories/services-repository';
import type { Service, Role } from '@prisma/client';
import { ServiceAlreadyExistsError } from './errors/service-already-exists-error';

interface CreateServiceRequest {
  nome: string;
  descricao?: string;
  precoPadrao: number;
  duracao: number;
  categoria?: string;
  requestRole?: Role;
}

interface CreateServiceResponse {
  service: Service;
}

export class CreateServiceUseCase {
  constructor(private servicesRepository: ServicesRepository) {}

  async execute({
    nome,
    descricao,
    precoPadrao,
    duracao,
    categoria,
  }: CreateServiceRequest): Promise<CreateServiceResponse> {
    const existingService = await this.servicesRepository.findByName(nome);
    if (existingService) {
      throw new ServiceAlreadyExistsError();
    }

    const service = await this.servicesRepository.create({
      nome,
      descricao,
      precoPadrao,
      duracao,
      categoria,
    });

    return { service };
  }
}
