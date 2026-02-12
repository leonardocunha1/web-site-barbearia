import { Professional, Service, User } from '@prisma/client';
import { PaginatedResponse } from './pagination';
import { omit } from '@/utils/dto-helpers';

export type ProfessionalDTO = {
  id: string;
  especialidade: string;
  bio?: string;
  avatarUrl?: string;
  ativo: boolean;
  user: {
    id: string; name: string;
    email: string;
    telefone?: string;
  };
  services: {
    id: string; name: string;
    descricao?: string;
    linked: boolean;
  }[];
};

/**
 * Converts Professional entity with relations to safe DTO
 * Automatically removes sensitive user fields (senha, etc.)
 * 
 * @param professional - Professional entity from database with user relation
 * @returns Safe professional DTO without sensitive data
 */
export function toProfessionalDTO(
  professional: Professional & {
    user: User;
    services: (Service & { linked: boolean })[];
  },
): ProfessionalDTO {
  // Remove sensitive user fields
  const safeUser = omit(professional.user, ['senha', 'emailVerified', 'active', 'role', 'createdAt', 'updatedAt']);
  
  return {
    id: professional.id,
    especialidade: professional.specialty,
    bio: professional.bio ?? undefined,
    avatarUrl: professional.avatarUrl ?? undefined,
    ativo: professional.active,
    user: {
      id: safeUser.id, name: safeUser.name,
      email: safeUser.email,
      telefone: safeUser.phone ?? undefined,
    },
    services: professional.services.map((service) => ({
      id: service.id, name: service.name, description: service.description ?? undefined,
      linked: service.linked, 
    })),
  };
}

/**
 * @deprecated Use PaginatedResponse<ProfessionalDTO> from @/dtos/pagination instead
 */
export type ListProfessionalsResponse = {
  professionals: ProfessionalDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
