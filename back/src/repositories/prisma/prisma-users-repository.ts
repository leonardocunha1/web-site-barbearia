import { Prisma, Role, User } from '@prisma/client';
import { UsersRepository } from '@/repositories/users-repository';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';

export class InMemoryUsersRepository implements UsersRepository {
  private users: User[] = [];

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null;
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user: User = {
      id: randomUUID(),
      nome: data.nome,
      email: data.email,
      senha: data.senha,
      telefone: data.telefone ?? null,
      role: data.role ?? Role.CLIENTE,
      emailVerified: data.emailVerified ?? false,
      active: data.active ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(user);
    return user;
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) throw new Error('User not found');

    const existing = this.users[userIndex];

    const updatedUser: User = {
      ...existing,
      nome: (data.nome as string) ?? existing.nome,
      email: (data.email as string) ?? existing.email,
      senha: (data.senha as string) ?? existing.senha,
      telefone: (data.telefone as string | null) ?? existing.telefone,
      role: (data.role as Role) ?? existing.role,
      emailVerified: (data.emailVerified as boolean) ?? existing.emailVerified,
      active: (data.active as boolean) ?? existing.active,
      updatedAt: new Date(),
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  async updatePassword(id: string, password: string): Promise<User> {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) throw new Error('User not found');

    this.users[userIndex].senha = password;
    this.users[userIndex].updatedAt = new Date();

    return this.users[userIndex];
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
    let filtered = this.users;

    if (role) filtered = filtered.filter((user) => user.role === role);
    if (name)
      filtered = filtered.filter((user) =>
        user.nome.toLowerCase().includes(name.toLowerCase()),
      );

    return filtered
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * limit, page * limit);
  }

  async countUsers({
    role,
    name,
  }: {
    role?: Role;
    name?: string;
  }): Promise<number> {
    let filtered = this.users;

    if (role) filtered = filtered.filter((user) => user.role === role);
    if (name)
      filtered = filtered.filter((user) =>
        user.nome.toLowerCase().includes(name.toLowerCase()),
      );

    return filtered.length;
  }

  async anonymize(userId: string): Promise<void> {
    const index = this.users.findIndex((user) => user.id === userId);
    if (index === -1) throw new Error('User not found');

    const anonymizedEmail = `anon-${Date.now()}-${Math.random().toString(36).substring(2)}@deleted.com`;
    const anonymizedPhone = `deleted-${Math.random().toString(36).substring(2, 10)}`;

    this.users[index] = {
      ...this.users[index],
      email: anonymizedEmail,
      telefone: anonymizedPhone,
      senha: await bcrypt.hash('deleted-account', 6),
      active: false,
      updatedAt: new Date(),
    };
  }
}
