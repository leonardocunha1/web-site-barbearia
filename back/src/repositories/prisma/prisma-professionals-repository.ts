import { Prisma, Professional } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { ProfessionalsRepository } from '../professionals-repository';

export class PrismaProfessionalsRepository implements ProfessionalsRepository {
  async findById(id: string): Promise<Professional | null> {
    return prisma.professional.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string): Promise<Professional | null> {
    return prisma.professional.findUnique({
      where: { userId },
    });
  }

  async create(
    data: Prisma.ProfessionalUncheckedCreateInput,
  ): Promise<Professional> {
    return prisma.professional.create({
      data,
    });
  }

  async update(
    id: string,
    data: Prisma.ProfessionalUncheckedUpdateInput,
  ): Promise<Professional> {
    return prisma.professional.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.professional.delete({
      where: { id },
    });
  }
}
