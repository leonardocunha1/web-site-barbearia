import { Prisma, Professional } from '@prisma/client';

export interface ProfessionalsRepository {
  findById(id: string): Promise<Professional | null>;
  findByUserId(userId: string): Promise<Professional | null>;
  create(
    data: Omit<Professional, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Professional>;
  update(
    id: string,
    data: Prisma.ProfessionalUncheckedUpdateInput,
  ): Promise<Professional | null>;
  delete(id: string): Promise<void>;
}
