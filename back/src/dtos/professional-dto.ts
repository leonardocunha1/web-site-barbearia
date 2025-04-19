import { Professional, Service, User } from '@prisma/client';

export type ProfessionalDTO = {
  id: string;
  especialidade: string;
  bio: string | null;
  avatarUrl: string | null;
  ativo: boolean;
  intervalosAgendamento: number;
  user: {
    id: string;
    nome: string;
    email: string;
  };
  services: {
    id: string;
    nome: string;
    descricao: string | null;
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
    bio: professional.bio,
    avatarUrl: professional.avatarUrl,
    ativo: professional.ativo,
    intervalosAgendamento: professional.intervalosAgendamento,
    user: {
      id: professional.user.id,
      nome: professional.user.nome,
      email: professional.user.email,
    },
    services: professional.services.map((service) => ({
      id: service.id,
      nome: service.nome,
      descricao: service.descricao,
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
