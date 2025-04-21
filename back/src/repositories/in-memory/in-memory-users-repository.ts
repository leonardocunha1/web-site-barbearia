import { Prisma, Role, User } from '@prisma/client';
import { UsersRepository } from '@/repositories/users-repository';
import { randomUUID } from 'crypto';
import { hash } from 'bcryptjs';

export class InMemoryUsersRepository implements UsersRepository {
  private users: User[] = [];

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const now = new Date();

    const user: User = {
      id: data.id ?? randomUUID(),
      nome: data.nome,
      email: data.email,
      senha: data.senha,
      telefone: data.telefone ?? null,
      role: data.role ?? 'CLIENTE',
      emailVerified: !!data.emailVerified,
      active: data.active ?? true,
      createdAt: data.createdAt ? new Date(data.createdAt) : now,
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : now,
    };

    this.users.push(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) ?? null;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) ?? null;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) throw new Error('User not found');

    const updatedUser = {
      ...this.users[userIndex],
      ...data,
      updatedAt: new Date(),
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  async updatePassword(id: string, password: string): Promise<User> {
    return this.update(id, { senha: password });
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
    let filtered = [...this.users];

    if (role) {
      filtered = filtered.filter((user) => user.role === role);
    }

    if (name) {
      const nameLower = name.toLowerCase();
      filtered = filtered.filter((user) =>
        user.nome.toLowerCase().includes(nameLower),
      );
    }

    const start = (page - 1) * limit;
    const end = start + limit;

    return filtered.slice(start, end);
  }

  async countUsers({
    role,
    name,
  }: {
    role?: Role;
    name?: string;
  }): Promise<number> {
    let filtered = [...this.users];

    if (role) {
      filtered = filtered.filter((user) => user.role === role);
    }

    if (name) {
      const nameLower = name.toLowerCase();
      filtered = filtered.filter((user) =>
        user.nome.toLowerCase().includes(nameLower),
      );
    }

    return filtered.length;
  }

  async anonymize(userId: string): Promise<void> {
    const user = await this.findById(userId);
    if (!user) return;

    user.email = `anon-${Date.now()}@deleted.com`;
    user.telefone = `deleted-${Math.random().toString(36).substring(2, 10)}`;
    user.active = false;
    user.senha = await hash('deleted-account', 6);
    user.updatedAt = new Date();
  }
}
