import { User } from '@prisma/client';

export type UserDTO = {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  role: string;
  emailVerified: Date | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export function toUserDTO(user: User): UserDTO {
  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    role: user.role,
    active: user.active,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    telefone: user.telefone,
    emailVerified: user.emailVerified,
  };
}

export type ListUsersResponse = {
  users: UserDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
