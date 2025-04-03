import { Prisma, User } from '@prisma/client';

export interface UpdateUserData {
  emailVerified?: Date;
}

export interface UsersRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: Prisma.UserCreateInput): Promise<User>;
  update(id: string, data: UpdateUserData): Promise<void>;
}
