import { Professional, Service, User } from '@prisma/client';

export type ProfessionalDTO = {
  id: string;
  especialidade: string;
  bio?: string;
  avatarUrl?: string;
  ativo: boolean;
  user: {
    id: string;
    nome: string;
    email: string;
    telefone?: string;
  };
  services: {
    id: string;
    nome: string;
    descricao?: string;
  }[];
};

export function toProfessionalDTO(
  professional: Professional & {
    user: User;
    services: Service[];
  },
): ProfessionalDTO {
  return {
    id: professional.id,
    especialidade: professional.especialidade,
    bio: professional.bio ?? undefined,
    avatarUrl: professional.avatarUrl ?? undefined,
    ativo: professional.ativo,
    user: {
      id: professional.user.id,
      nome: professional.user.nome,
      email: professional.user.email,
      telefone: professional.user.telefone ?? undefined,
    },
    services: professional.services.map((service) => ({
      id: service.id,
      nome: service.nome,
      descricao: service.descricao ?? undefined,
    })),
  };
}

export type ListProfessionalsResponse = {
  professionals: ProfessionalDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
