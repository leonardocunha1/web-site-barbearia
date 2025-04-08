import { User, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { UsersRepository } from '@/repositories/users-repository';

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const now = new Date();

    const user: User = {
      id: data.id ?? randomUUID(),
      nome: data.nome,
      email: data.email,
      senha: data.senha,
      telefone: data.telefone ?? null,
      role: data.role ?? 'CLIENTE',
      emailVerified: data.emailVerified ? new Date(data.emailVerified) : null,
      active: data.active ?? true,
      createdAt: data.createdAt ? new Date(data.createdAt) : now,
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : now,
    };

    this.items.push(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.items.find((user) => user.email === email) ?? null;
  }

  async findById(id: string): Promise<User | null> {
    return this.items.find((user) => user.id === id) ?? null;
  }

  async update(id: string, data: Partial<User>): Promise<void> {
    const userIndex = this.items.findIndex((user) => user.id === id);
    if (userIndex >= 0) {
      const currentUser = this.items[userIndex];

      this.items[userIndex] = {
        ...currentUser,
        ...data,
        updatedAt: new Date(),
      };
    }
  }
}
