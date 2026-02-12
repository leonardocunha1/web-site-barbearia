import { Prisma, Professional, Service, User } from '@prisma/client';

export interface IProfessionalsRepository {
  findById(id: string): Promise<Professional | null>;
  findByUserId(userId: string): Promise<Professional | null>;
  findByProfessionalId(
    professionalId: string,
  ): Promise<(Professional & { user: User }) | null>;
  create(data: Prisma.ProfessionalCreateInput): Promise<Professional>;
  update(
    id: string, date: Prisma.ProfessionalUncheckedUpdateInput,
  ): Promise<Professional>; 
  delete(id: string): Promise<void>;

  list(params: {
    page: number;
    limit: number;
    especialidade?: string;
    ativo?: boolean;
    sortBy?: string;
    sortDirection?: "asc" | "desc";
  }): Promise<
    (Professional & {
      user: User;
      services: (Service & { linked: boolean })[];
    })[]
  >;

  count(params: { especialidade?: string; ativo?: boolean }): Promise<number>;

  search(params: {
    query: string;
    page: number;
    limit: number;
    ativo?: boolean;
    sortBy?: string;
    sortDirection?: "asc" | "desc";
  }): Promise<
    (Professional & {
      user: User;
      services: (Service & { linked: boolean })[];
    })[]
  >;

  countSearch(params: { query: string; ativo?: boolean }): Promise<number>;
}

