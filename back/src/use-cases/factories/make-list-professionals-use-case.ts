import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { ListOrSearchProfessionalsUseCase } from '../professional/list-professionals-use-case';

export function makeListProfessionalsUseCase() {
  const professionalsRepository = new PrismaProfessionalsRepository();
  const useCase = new ListOrSearchProfessionalsUseCase(professionalsRepository);

  return useCase;
}
