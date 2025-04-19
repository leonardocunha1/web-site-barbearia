import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { ListProfessionalsUseCase } from '../professional/list-professionals-use-case';

export function makeListProfessionalsUseCase() {
  const professionalsRepository = new PrismaProfessionalsRepository();
  const useCase = new ListProfessionalsUseCase(professionalsRepository);

  return useCase;
}
