import { Prisma, Role, User } from '@prisma/client';

export interface IUsersRepository {
  findById(id: string): Promise<User | null>;
  findByPhone(phone: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: Prisma.UserCreateInput): Promise<User>;
  update(id: string, data: Prisma.UserUpdateInput): Promise<User>;
  updatePassword(id: string, password: string): Promise<User>;
  listUsers(params: { page: number; limit: number; role?: Role; name?: string }): Promise<User[]>;
  countUsers(params: { role?: Role; name?: string }): Promise<number>;
  anonymize(userId: string): Promise<void>;
}
