import { Prisma, Role, User } from '@prisma/client';
import { IUsersRepository } from '@/repositories/users-repository';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { PASSWORD_HASH_ROUNDS } from '@/consts/const';

export class PrismaUsersRepository implements IUsersRepository {
  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async findByPhone(phone: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        phone,
      },
    });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return await prisma.user.create({ data });
  }

  async updatePassword(id: string, password: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { password },
    });
  }

  async listUsers({
    page,
    limit,
    role,
    name,
  }: {
    page: number;
    limit: number;
    role?: Role;
    name?: string;
  }): Promise<User[]> {
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};
    if (role) where.role = role;
    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    return prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async countUsers({ role, name }: { role?: Role; name?: string }): Promise<number> {
    const where: Prisma.UserWhereInput = {};
    if (role) where.role = role;
    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    return prisma.user.count({ where });
  }

  async anonymize(userId: string): Promise<void> {
    const anonymizedEmail = `anon-${randomUUID()}@deleted.com`;
    const anonymizedPhone = `deleted-${randomUUID().slice(0, 10)}`;

    await prisma.user.update({
      where: { id: userId },
      data: {
        email: anonymizedEmail,
        phone: anonymizedPhone,
        active: false,
        password: await bcrypt.hash('deleted-account', PASSWORD_HASH_ROUNDS),
      },
    });
  }
}
