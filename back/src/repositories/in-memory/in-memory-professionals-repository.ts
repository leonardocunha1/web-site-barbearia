import { Professional } from '@prisma/client';
import { ProfessionalsRepository } from '../professionals-repository';

export class InMemoryProfessionalsRepository
  implements ProfessionalsRepository
{
  public items: Professional[] = [];

  async create(
    data: Omit<Professional, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Professional> {
    const professional: Professional = {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    };

    this.items.push(professional);
    return professional;
  }

  async findByUserId(userId: string): Promise<Professional | null> {
    const professional = this.items.find((item) => item.userId === userId);
    return professional ?? null;
  }

  async findById(id: string): Promise<Professional | null> {
    const professional = this.items.find((item) => item.id === id);
    return professional ?? null;
  }

  async update(
    id: string,
    data: Partial<Omit<Professional, 'id' | 'createdAt'>>,
  ): Promise<Professional | null> {
    const index = this.items.findIndex((item) => item.id === id);

    if (index === -1) return null;

    const existing = this.items[index];

    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };

    this.items[index] = updated;

    return updated;
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((item) => item.id !== id);
  }
}
