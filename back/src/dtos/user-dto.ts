import { User, Role } from '@prisma/client';

export interface UserDTO {
  id: string;
  nome: string;
  email: string;
  telefone?: string | null;
  role: Role;
  emailVerified: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function toUserDTO(user: User): UserDTO {
  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    telefone: user.telefone,
    role: user.role,
    emailVerified: user.emailVerified,
    active: user.active,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export type ListUsersResponse = {
  users: UserDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
