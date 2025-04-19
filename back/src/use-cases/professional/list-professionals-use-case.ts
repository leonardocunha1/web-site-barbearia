import { ProfessionalsRepository } from '@/repositories/professionals-repository';
import {
  toProfessionalDTO,
  ListProfessionalsResponse,
} from '@/dtos/professional-dto';

interface ListProfessionalsUseCaseRequest {
  page?: number;
  limit?: number;
  especialidade?: string;
  ativo?: boolean;
}

export class ListProfessionalsUseCase {
  constructor(private professionalsRepository: ProfessionalsRepository) {}

  async execute({
    page = 1,
    limit = 10,
    especialidade,
    ativo,
  }: ListProfessionalsUseCaseRequest): Promise<ListProfessionalsResponse> {
    const [professionals, total] = await Promise.all([
      this.professionalsRepository.list({ page, limit, especialidade, ativo }),
      this.professionalsRepository.count({ especialidade, ativo }),
    ]);

    if (total === 0) {
      return {
        professionals: [],
        total,
        page,
        limit,
        totalPages: 0,
      };
    }

    return {
      professionals: professionals.map(toProfessionalDTO),
      total,
      page,
      limit,
      totalPages: limit > 0 ? Math.ceil(total / limit) : 0,
    };
  }
}
