import { User, Role } from '@prisma/client';
import { sanitizeUser } from '@/utils/dto-helpers';

/**
 * User Data Transfer Object
 * Excludes sensitive fields like password
 */
export interface UserDTO {
  id: string; name: string;
  email: string;
  telefone?: string | null;
  role: Role;
  emailVerified: boolean;
  active: boolean;
  createdAt: Date;
}

/**
 * Converts User entity to safe DTO
 * Automatically removes password and other sensitive fields
 * 
 * @param user - User entity from database
 * @returns Safe user DTO without sensitive data
 * 
 * @example
 * ```typescript
 * const user = await usersRepository.findById(id);
 * return reply.send({ user: toUserDTO(user) });
 * ```
 */
export function toUserDTO(user: User): UserDTO {
  const sanitized = sanitizeUser(user);
  
  return {
    id: sanitized.id, name: sanitized.name,
    email: sanitized.email,
    telefone: sanitized.phone,
    role: sanitized.role,
    emailVerified: sanitized.emailVerified,
    active: sanitized.active,
    createdAt: sanitized.createdAt,
  };
}

/**
 * @deprecated Use PaginatedResponse<UserDTO> from @/dtos/pagination instead
 */
export type ListUsersResponse = {
  users: UserDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
