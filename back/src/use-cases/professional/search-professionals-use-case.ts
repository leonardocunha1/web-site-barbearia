import { ProfessionalsRepository } from '@/repositories/professionals-repository';
import {
  toProfessionalDTO,
  ListProfessionalsResponse,
} from '@/dtos/professional-dto';
import { InvalidQueryError } from '../errors/invalid-query-error';
import { InvalidPageError } from '../errors/invalid-page-error';
import { InvalidLimitError } from '../errors/invalid-limit-error';

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
    if (!query || query.trim() === '') {
      throw new InvalidQueryError();
    }

    if (page < 1) {
      throw new InvalidPageError();
    }

    if (limit < 1 || limit > 100) {
      throw new InvalidLimitError();
    }

    const isAtivo = typeof ativo === 'boolean' ? ativo : true;

    const [professionals, total] = await Promise.all([
      this.professionalsRepository.search({
        query,
        page,
        limit,
        ativo: isAtivo,
      }),
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
