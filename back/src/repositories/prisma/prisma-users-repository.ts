import { Prisma, User } from '@prisma/client';
import { UpdateUserData, UsersRepository } from '@/repositories/users-repository';
import { prisma } from '@/lib/prisma';

export class PrismaUsersRepository implements UsersRepository {
  async update(id: string, data: UpdateUserData): Promise<void> {
    await prisma.user.update({
      where: { id },
      data,
    });
  }

  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return await prisma.user.create({ data });
  }
}