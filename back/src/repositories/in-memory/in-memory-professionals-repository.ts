import { Prisma, Professional, Service, User } from '@prisma/client';
import { ProfessionalsRepository } from '../professionals-repository';
import { randomUUID } from 'node:crypto';

// Interface auxiliar para armazenar relações em memória
interface InMemoryProfessional extends Professional {
  user?: User;
  services?: Service[];
}

export class InMemoryProfessionalsRepository
  implements ProfessionalsRepository
{
  public items: InMemoryProfessional[] = [];
  private users: User[] = [];
  private services: Service[] = [];

  // Método auxiliar para adicionar usuários (usado em testes)
  addUser(user: User) {
    this.users.push(user);
  }

  // Método auxiliar para adicionar serviços (usado em testes)
  addService(service: Service) {
    this.services.push(service);
  }

  async findById(id: string): Promise<Professional | null> {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async findByUserId(userId: string): Promise<Professional | null> {
    return this.items.find((item) => item.userId === userId) ?? null;
  }

  async findByProfessionalId(
    professionalId: string,
  ): Promise<(Professional & { user: User }) | null> {
    const professional = this.items.find((item) => item.id === professionalId);
    if (!professional) return null;

    const user = this.users.find((u) => u.id === professional.userId);
    if (!user) return null;

    return {
      ...professional,
      user,
    };
  }

  async create(data: Prisma.ProfessionalCreateInput): Promise<Professional> {
    const professional: InMemoryProfessional = {
      id: randomUUID(),
      userId: data.user.connect?.id || '',
      especialidade: data.especialidade,
      bio: data.bio ?? null,
      avatarUrl: data.avatarUrl ?? null,
      documento: data.documento ?? null,
      ativo: data.ativo ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.items.push(professional);
    return professional;
  }

  async update(
    id: string,
    data: Prisma.ProfessionalUncheckedUpdateInput,
  ): Promise<Professional | null> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const existing = this.items[index];

    const updated: InMemoryProfessional = {
      ...existing,
      especialidade: (data.especialidade as string) ?? existing.especialidade,
      bio: (data.bio as string | null) ?? existing.bio,
      avatarUrl: (data.avatarUrl as string | null) ?? existing.avatarUrl,
      documento: (data.documento as string | null) ?? existing.documento,
      ativo: (data.ativo as boolean) ?? existing.ativo,
      updatedAt: new Date(),
    };

    this.items[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((item) => item.id !== id);
  }

  async list(params: {
    page: number;
    limit: number;
    especialidade?: string;
    ativo?: boolean;
  }): Promise<(Professional & { user: User; services: Service[] })[]> {
    const { page, limit, especialidade, ativo } = params;
    const startIndex = (page - 1) * limit;

    let filtered = this.items;

    if (especialidade) {
      filtered = filtered.filter((item) =>
        item.especialidade.toLowerCase().includes(especialidade.toLowerCase()),
      );
    }

    if (ativo !== undefined) {
      filtered = filtered.filter((item) => item.ativo === ativo);
    }

    const paginated = filtered.slice(startIndex, startIndex + limit);

    return paginated.map((professional) => ({
      ...professional,
      user:
        this.users.find((u) => u.id === professional.userId) ?? ({} as User),
      services: this.services, // Mock - em um cenário real é necessário armazenar as relações
    }));
  }

  async count(params: {
    especialidade?: string;
    ativo?: boolean;
  }): Promise<number> {
    const { especialidade, ativo } = params;

    let filtered = this.items;

    if (especialidade) {
      filtered = filtered.filter((item) =>
        item.especialidade.toLowerCase().includes(especialidade.toLowerCase()),
      );
    }

    if (ativo !== undefined) {
      filtered = filtered.filter((item) => item.ativo === ativo);
    }

    return filtered.length;
  }

  async search(params: {
    query: string;
    page: number;
    limit: number;
    ativo?: boolean;
  }): Promise<(Professional & { user: User; services: Service[] })[]> {
    const { query, page, limit, ativo } = params;
    const startIndex = (page - 1) * limit;

    let filtered = this.items.filter((item) => {
      const matchesUser = this.users.some(
        (u) =>
          u.id === item.userId &&
          u.nome.toLowerCase().includes(query.toLowerCase()),
      );

      return (
        item.especialidade.toLowerCase().includes(query.toLowerCase()) ||
        matchesUser
      );
    });

    if (ativo !== undefined) {
      filtered = filtered.filter((item) => item.ativo === ativo);
    }

    const paginated = filtered.slice(startIndex, startIndex + limit);

    return paginated.map((professional) => ({
      ...professional,
      user:
        this.users.find((u) => u.id === professional.userId) ?? ({} as User),
      services: this.services, // Mock - em um cenário real é necessário armazenar as relações
    }));
  }

  async countSearch(params: {
    query: string;
    ativo?: boolean;
  }): Promise<number> {
    const { query, ativo } = params;

    let filtered = this.items.filter((item) => {
      const matchesUser = this.users.some(
        (u) =>
          u.id === item.userId &&
          u.nome.toLowerCase().includes(query.toLowerCase()),
      );

      return (
        item.especialidade.toLowerCase().includes(query.toLowerCase()) ||
        matchesUser
      );
    });

    if (ativo !== undefined) {
      filtered = filtered.filter((item) => item.ativo === ativo);
    }

    return filtered.length;
  }
}
