import { Prisma, Professional, Service, User } from '@prisma/client';
import { ProfessionalsRepository } from '../professionals-repository';
import { randomUUID } from 'node:crypto';

export class InMemoryProfessionalsRepository
  implements ProfessionalsRepository
{
  public items: Professional[] = [];
  public users: User[] = [];
  public services: Service[] = [];

  // Métodos auxiliares para testes
  addUser(user: User) {
    this.users.push(user);
  }

  addService(service: Service) {
    this.services.push(service);
  }

  // Métodos principais
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
    const professional: Professional = {
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

    const updatedProfessional = {
      ...this.items[index],
      especialidade:
        (data.especialidade as string) ?? this.items[index].especialidade,
      bio: (data.bio as string | null) ?? this.items[index].bio,
      avatarUrl:
        (data.avatarUrl as string | null) ?? this.items[index].avatarUrl,
      documento:
        (data.documento as string | null) ?? this.items[index].documento,
      ativo: (data.ativo as boolean) ?? this.items[index].ativo,
      updatedAt: new Date(),
    };

    this.items[index] = updatedProfessional;
    return updatedProfessional;
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

    let filtered = [...this.items];

    if (especialidade) {
      filtered = filtered.filter((item) =>
        item.especialidade.toLowerCase().includes(especialidade.toLowerCase()),
      );
    }

    if (ativo !== undefined) {
      filtered = filtered.filter((item) => item.ativo === ativo);
    }

    return filtered
      .slice(startIndex, startIndex + limit)
      .map((professional) => this.enrichProfessional(professional));
  }

  async count(params: {
    especialidade?: string;
    ativo?: boolean;
  }): Promise<number> {
    const { especialidade, ativo } = params;

    let filtered = [...this.items];

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
    const { query, page, limit, ativo = true } = params;
    const startIndex = (page - 1) * limit;

    const filtered = this.items.filter((professional) => {
      const userMatch = this.users.some(
        (user) =>
          user.id === professional.userId &&
          user.nome.toLowerCase().includes(query.toLowerCase()),
      );

      const specialtyMatch = professional.especialidade
        .toLowerCase()
        .includes(query.toLowerCase());

      const statusMatch = ativo === undefined || professional.ativo === ativo;

      return (userMatch || specialtyMatch) && statusMatch;
    });

    return filtered
      .slice(startIndex, startIndex + limit)
      .map((professional) => this.enrichProfessional(professional));
  }

  async countSearch(params: {
    query: string;
    ativo?: boolean;
  }): Promise<number> {
    const { query, ativo = true } = params;

    return this.items.filter((professional) => {
      const userMatch = this.users.some(
        (user) =>
          user.id === professional.userId &&
          user.nome.toLowerCase().includes(query.toLowerCase()),
      );

      const specialtyMatch = professional.especialidade
        .toLowerCase()
        .includes(query.toLowerCase());

      const statusMatch = ativo === undefined || professional.ativo === ativo;

      return (userMatch || specialtyMatch) && statusMatch;
    }).length;
  }

  private enrichProfessional(
    professional: Professional,
  ): Professional & { user: User; services: Service[] } {
    const user = this.users.find((u) => u.id === professional.userId);

    if (!user) {
      throw new Error(
        `Usuário não encontrado para o profissional: ${professional.id}`,
      );
    }

    return {
      ...professional,
      user,
      services: [],
    };
  }
}
