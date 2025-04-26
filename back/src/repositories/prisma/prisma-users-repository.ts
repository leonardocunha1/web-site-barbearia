import { Prisma, Role, User } from '@prisma/client';
import { UsersRepository } from '@/repositories/users-repository';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export class PrismaUsersRepository implements UsersRepository {
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
      data: { senha: password },
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
      where.nome = {
        contains: name,
        mode: 'insensitive', // Busca case-insensitive
      };
    }

    return prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async countUsers({
    role,
    name,
  }: {
    role?: Role;
    name?: string;
  }): Promise<number> {
    const where: Prisma.UserWhereInput = {};
    if (role) where.role = role;
    if (name) {
      where.nome = {
        contains: name,
        mode: 'insensitive',
      };
    }

    return prisma.user.count({ where });
  }

  async anonymize(userId: string): Promise<void> {
    const anonymizedEmail = `anon-${Date.now()}-${bcrypt.hash(userId, 6)}@deleted.com`;
    const anonymizedPhone = `deleted-${Math.random().toString(36).substring(2, 10)}`;

    await prisma.user.update({
      where: { id: userId },
      data: {
        email: anonymizedEmail,
        telefone: anonymizedPhone,
        active: false,
        senha: await bcrypt.hash('deleted-account', 6), // Senha padrão para conta deletada
      },
    });
  }
}
