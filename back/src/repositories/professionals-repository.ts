import { Prisma, Professional, Service, User } from '@prisma/client';

export interface ProfessionalsRepository {
  findById(id: string): Promise<Professional | null>;
  findByUserId(userId: string): Promise<Professional | null>;
  findByProfessionalId(
    professionalId: string,
  ): Promise<(Professional & { user: User }) | null>;
  create(data: Prisma.ProfessionalCreateInput): Promise<Professional>;
  update(
    id: string,
    data: Prisma.ProfessionalUncheckedUpdateInput,
  ): Promise<Professional | null>;
  delete(id: string): Promise<void>;
  list(params: {
    page: number;
    limit: number;
    especialidade?: string;
    ativo?: boolean;
  }): Promise<(Professional & { user: User; services: Service[] })[]>;
  count(params: { especialidade?: string; ativo?: boolean }): Promise<number>;
  search(params: {
    query: string;
    page: number;
    limit: number;
    ativo?: boolean;
  }): Promise<
    (Professional & {
      user: User;
      services: Service[];
    })[]
  >;

  countSearch(params: { query: string; ativo?: boolean }): Promise<number>;
}
