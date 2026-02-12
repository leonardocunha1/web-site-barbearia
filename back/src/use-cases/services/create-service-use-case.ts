import { IServicesRepository } from '@/repositories/services-repository';
import type { Service } from '@prisma/client';
import { ServiceAlreadyExistsError } from '../errors/service-already-exists-error';
interface CreateServiceResponse {
  service: Service;
}
interface CreateServiceRequest { name: string;
  descricao?: string;
  categoria?: string;
  ativo: boolean; 
}

export class CreateServiceUseCase {
  constructor(private servicesRepository: IServicesRepository) {}

  async execute({
    nome,
    descricao,
    categoria,
    ativo,
  }: CreateServiceRequest): Promise<CreateServiceResponse> {
    const existingService = await this.servicesRepository.findByName(nome);
    if (existingService) {
      throw new ServiceAlreadyExistsError();
    }

    const service = await this.servicesRepository.create({
      nome,
      descricao,
      categoria,
      ativo,
    });

    return { service };
  }
}

