import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { SearchProfessionalsUseCase } from '../professional/search-professionals-use-case';

export function makeSearchProfessionalsUseCase() {
  const professionalsRepository = new PrismaProfessionalsRepository();
  const useCase = new SearchProfessionalsUseCase(professionalsRepository);

  return useCase;
}
