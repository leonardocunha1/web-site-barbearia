import { describe, expect, it, vi, beforeEach } from 'vitest';
import { GetUserProfileUseCase } from './get-user-profile-use-case';
import { IUsersRepository } from '@/repositories/users-repository';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { User, Role } from '@prisma/client';
import { createMockUsersRepository } from '@/mock/mock-repositories';
import { makeUser } from '@/test/factories';

// Tipo para o mock do repositório
type MockUsersRepository = IUsersRepository & {
  findById: ReturnType<typeof vi.fn>;
};

describe('GetUserProfileUseCase', () => {
  let usersRepository: MockUsersRepository;
  let sut: GetUserProfileUseCase;

  beforeEach(() => {
    usersRepository = createMockUsersRepository();

    sut = new GetUserProfileUseCase(usersRepository);
  });

  it('deve retornar o perfil completo do usuário com sucesso', async () => {
    const mockDate = new Date();
    const mockUser: User = makeUser({
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123456789',
      role: Role.CLIENT,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    usersRepository.findById.mockResolvedValue(mockUser);

    const { user } = await sut.execute({ userId: 'user-1' });

    expect(user).toEqual(mockUser);
    expect(usersRepository.findById).toHaveBeenCalledWith('user-1');
  });

  it('deve lançar erro quando o usuário não existe', async () => {
    usersRepository.findById.mockResolvedValue(null);

    await expect(sut.execute({ userId: 'non-existent-user' })).rejects.toThrow(UserNotFoundError);

    expect(usersRepository.findById).toHaveBeenCalledWith('non-existent-user');
  });

  it('deve lançar erro quando o userId não é fornecido', async () => {
    await expect(sut.execute({ userId: '' })).rejects.toThrow(UserNotFoundError);

    expect(usersRepository.findById).toHaveBeenCalledWith('');
  });

  it('deve retornar o perfil completo mesmo com campos opcionais nulos', async () => {
    const mockDate = new Date();
    const mockUser: User = makeUser({
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      role: Role.CLIENT,
      emailVerified: false,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    // Override phone to null after factory creation
    (mockUser as any).phone = null;

    usersRepository.findById.mockResolvedValue(mockUser);

    const { user } = await sut.execute({ userId: 'user-1' });

    expect(user).toEqual(mockUser);
  });

  it('deve incluir todos os campos do User, incluindo a senha', async () => {
    const mockUser: User = makeUser({
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123456789',
      role: Role.ADMIN,
    });

    usersRepository.findById.mockResolvedValue(mockUser);

    const { user } = await sut.execute({ userId: 'user-1' });

    expect(user).toHaveProperty('password', 'hashed-password');
    expect(user).toHaveProperty('updatedAt');
    expect(user).toHaveProperty('createdAt');
  });
});
