import { ServicesRepository } from '@/repositories/services-repository';
import { Service } from '@prisma/client';

interface ListServicesRequest {
  page: number;
  limit: number;
  nome?: string;
  categoria?: string;
  ativo?: boolean;
  professionalId?: string;
}

interface ListServicesResponse {
  services: Service[];
  total: number;
  totalPages: number;
}

export class ListServicesUseCase {
  constructor(private servicesRepository: ServicesRepository) {}

  async execute({
    page,
    limit,
    nome,
    categoria,
    ativo,
    professionalId,
  }: ListServicesRequest): Promise<ListServicesResponse> {
    const { services, total } = await this.servicesRepository.list({
      page,
      limit,
      nome,
      categoria,
      ativo,
      professionalId,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      services,
      total,
      totalPages,
    };
  }
}
