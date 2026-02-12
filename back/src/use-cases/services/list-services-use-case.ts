import { IServicesRepository } from '@/repositories/services-repository';
import { Service } from '@prisma/client';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { IProfessionalsRepository } from '@/repositories/professionals-repository';
import { validatePagination } from '@/utils/validate-pagination';

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
  constructor(
    private servicesRepository: IServicesRepository,
    private professionalRepository: IProfessionalsRepository,
  ) {}

  async execute({
    page,
    limit,
    nome,
    categoria,
    ativo,
    professionalId,
  }: ListServicesRequest): Promise<ListServicesResponse> {
    validatePagination(page, limit);

    if (professionalId) {
      const professionalExists =
        await this.professionalRepository.findById(professionalId);

      if (!professionalExists) {
        throw new ProfessionalNotFoundError();
      }
    }

    const { services, total } = await this.servicesRepository.list({
      page,
      limit,
      nome,
      categoria,
      ativo,
      professionalId,
    });

    if (services.length === 0) {
      return {
        services: [],
        total: 0,
        totalPages: 0,
      };
    }

    const totalPages = Math.ceil(total / limit);

    return {
      services,
      total,
      totalPages,
    };
  }
}

