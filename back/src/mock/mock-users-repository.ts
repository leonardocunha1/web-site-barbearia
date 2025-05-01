import { vi } from 'vitest';
import { Prisma, Role, User } from '@prisma/client';

export const createMockUsersRepository = () => {
  const createMockUser = (overrides?: Partial<User>): User => ({
    id: 'user-1',
    nome: 'John Doe',
    email: 'john@example.com',
    senha: 'hashed-password',
    telefone: null,
    role: 'CLIENTE' as Role,
    emailVerified: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  const mockRepository = {
    findById: vi
      .fn()
      .mockImplementation((id: string) =>
        Promise.resolve(createMockUser({ id })),
      ),
    findByEmail: vi
      .fn()
      .mockImplementation((email: string) =>
        Promise.resolve(createMockUser({ email })),
      ),
    create: vi.fn().mockImplementation((data: Prisma.UserCreateInput) =>
      Promise.resolve(
        createMockUser({
          ...data,
          createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
          updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
        }),
      ),
    ),
    update: vi
      .fn()
      .mockImplementation((id: string, data: Prisma.UserUpdateInput) =>
        Promise.resolve(
          createMockUser({
            id,
            ...(data.nome
              ? {
                  nome:
                    typeof data.nome === 'string' ? data.nome : data.nome.set,
                }
              : {}),
            ...(data.email
              ? {
                  email:
                    typeof data.email === 'string'
                      ? data.email
                      : data.email.set,
                }
              : {}),
            ...(data.role ? { role: data.role as Role } : {}),
          }),
        ),
      ),
    updatePassword: vi
      .fn()
      .mockImplementation((id: string, password: string) =>
        Promise.resolve(createMockUser({ id, senha: password })),
      ),
    listUsers: vi
      .fn()
      .mockImplementation(
        (params: {
          page: number;
          limit: number;
          role?: Role;
          name?: string;
        }) => {
          const users = [
            createMockUser({ id: 'user-1', nome: 'John Doe', role: 'CLIENTE' }),
            createMockUser({
              id: 'user-2',
              nome: 'Jane Barber',
              role: 'PROFISSIONAL',
            }),
          ];

          return Promise.resolve(
            users
              .filter(
                (user) =>
                  (!params.role || user.role === params.role) &&
                  (!params.name || user.nome.includes(params.name)),
              )
              .slice(
                (params.page - 1) * params.limit,
                params.page * params.limit,
              ),
          );
        },
      ),
    countUsers: vi
      .fn()
      .mockImplementation((params: { role?: Role; name?: string }) => {
        const users = [
          createMockUser({ id: 'user-1', nome: 'John Doe', role: 'CLIENTE' }),
          createMockUser({
            id: 'user-2',
            nome: 'Jane Barber',
            role: 'PROFISSIONAL',
          }),
        ];

        return Promise.resolve(
          users.filter(
            (user) =>
              (!params.role || user.role === params.role) &&
              (!params.name || user.nome.includes(params.name)),
          ).length,
        );
      }),
    anonymize: vi.fn().mockResolvedValue(undefined),
  };

  return {
    mockRepository,
    createMockUser, // Retorna também a função que permite customizar o mock
  };
};
