import { ProfessionalsRepository } from '@/repositories/professionals-repository';
import {
  toProfessionalDTO,
  ListProfessionalsResponse,
} from '@/dtos/professional-dto';

interface SearchProfessionalsUseCaseRequest {
  query: string;
  page?: number;
  limit?: number;
  ativo?: boolean;
}

export class SearchProfessionalsUseCase {
  constructor(private professionalsRepository: ProfessionalsRepository) {}

  async execute({
    query,
    page = 1,
    limit = 10,
    ativo = true,
  }: SearchProfessionalsUseCaseRequest): Promise<ListProfessionalsResponse> {
    const [professionals, total] = await Promise.all([
      this.professionalsRepository.search({ query, page, limit, ativo }),
      this.professionalsRepository.countSearch({ query, ativo }),
    ]);

    return {
      professionals: professionals.map(toProfessionalDTO),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
