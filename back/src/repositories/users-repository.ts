import { Prisma, Role, User } from '@prisma/client';

export interface UsersRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: Prisma.UserCreateInput): Promise<User>;
  update(id: string, data: Prisma.UserUpdateInput): Promise<User>;
  updatePassword(id: string, password: string): Promise<User>;
  listUsers(page: number, limit: number, role?: Role): Promise<User[]>;
  countUsers(role?: Role): Promise<number>;
}
