import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdatePasswordUseCase } from './update-password-use-case';
import { IUsersRepository } from '@/repositories/users-repository';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { InvalidCredentialsError } from '../errors/invalid-credentials-error';
import { SamePasswordError } from '../errors/same-password-error';
import { createMockUsersRepository } from '@/mock/mock-repositories';

import bcrypt from 'bcryptjs';

vi.mock('bcryptjs', () => {
  return {
    default: {
      compare: vi.fn(),
      hash: vi.fn(),
    },
  };
}); // Importar depois do vi.mock
const bcryptCompare = bcrypt.compare as ReturnType<typeof vi.fn>;
const bcryptHash = bcrypt.hash as ReturnType<typeof vi.fn>;

type MockUsersRepository = IUsersRepository & {
  findById: ReturnType<typeof vi.fn>;
  updatePassword: ReturnType<typeof vi.fn>;
};

describe('Update Password Use Case', () => {
  let useCase: UpdatePasswordUseCase;
  let mockUsersRepository: MockUsersRepository;

  beforeEach(() => {
    vi.clearAllMocks();

    mockUsersRepository = {
      ...createMockUsersRepository(),
      findById: vi.fn(),
      updatePassword: vi.fn(),
    };

    useCase = new UpdatePasswordUseCase(mockUsersRepository);
  });

  const mockUser = {
    id: 'user-123',
    email: 'john@example.com',
    senha: 'hashed-current-password', name: 'John Doe',
    telefone: '123456789',
    role: 'CLIENT',
    active: true,
  };

  it('deve atualizar a senha com sucesso', async () => {
    mockUsersRepository.findById.mockResolvedValue(mockUser);
    bcryptCompare
      .mockResolvedValueOnce(true) // currentPassword confere
      .mockResolvedValueOnce(false); // newPassword diferente da atual
    bcryptHash.mockResolvedValue('hashed-new-password');
    mockUsersRepository.updatePassword.mockResolvedValue({
      ...mockUser,
      senha: 'hashed-new-password',
    });

    const result = await useCase.execute({
      userId: 'user-123',
      currentPassword: 'current-password',
      newPassword: 'new-password',
    });

    expect(result.user.id).toBe('user-123');
    expect(result.user.email).toBe('john@example.com');
    expect(bcryptCompare).toHaveBeenCalledWith(
      'current-password',
      'hashed-current-password',
    );
    expect(bcryptCompare).toHaveBeenCalledWith(
      'new-password',
      'hashed-current-password',
    );
    expect(bcryptHash).toHaveBeenCalledWith('new-password', 6);
    expect(mockUsersRepository.updatePassword).toHaveBeenCalledWith(
      'user-123',
      'hashed-new-password',
    );
  });

  it('deve lançar erro quando usuário não existe', async () => {
    mockUsersRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        userId: 'non-existent-user',
        currentPassword: 'current-password',
        newPassword: 'new-password',
      }),
    ).rejects.toThrow(UserNotFoundError);
    expect(mockUsersRepository.updatePassword).not.toHaveBeenCalled();
  });

  it('deve lançar erro quando a senha atual está incorreta', async () => {
    mockUsersRepository.findById.mockResolvedValue(mockUser);
    bcryptCompare.mockResolvedValue(false); // senha incorreta

    await expect(
      useCase.execute({
        userId: 'user-123',
        currentPassword: 'wrong-password',
        newPassword: 'new-password',
      }),
    ).rejects.toThrow(InvalidCredentialsError);
    expect(mockUsersRepository.updatePassword).not.toHaveBeenCalled();
  });

  it('deve lançar erro quando a nova senha é igual à atual', async () => {
    mockUsersRepository.findById.mockResolvedValue(mockUser);
    bcryptCompare
      .mockResolvedValueOnce(true) // senha atual confere
      .mockResolvedValueOnce(true); // nova senha igual à atual

    await expect(
      useCase.execute({
        userId: 'user-123',
        currentPassword: 'current-password',
        newPassword: 'same-as-current',
      }),
    ).rejects.toThrow(SamePasswordError);
    expect(mockUsersRepository.updatePassword).not.toHaveBeenCalled();
  });

  it('deve chamar bcrypt.hash com o custo 6', async () => {
    mockUsersRepository.findById.mockResolvedValue(mockUser);
    bcryptCompare.mockResolvedValueOnce(true).mockResolvedValueOnce(false);
    bcryptHash.mockResolvedValue('hashed-new-password');
    mockUsersRepository.updatePassword.mockResolvedValue(mockUser);

    await useCase.execute({
      userId: 'user-123',
      currentPassword: 'current-password',
      newPassword: 'new-password',
    });

    expect(bcryptHash).toHaveBeenCalledWith('new-password', 6);
  });

  it('deve retornar apenas id e email do usuário após atualização', async () => {
    mockUsersRepository.findById.mockResolvedValue(mockUser);
    bcryptCompare.mockResolvedValueOnce(true).mockResolvedValueOnce(false);
    bcryptHash.mockResolvedValue('hashed-new-password');
    mockUsersRepository.updatePassword.mockResolvedValue(mockUser);

    const result = await useCase.execute({
      userId: 'user-123',
      currentPassword: 'current-password',
      newPassword: 'new-password',
    });

    expect(result.user).toEqual({
      id: 'user-123',
      email: 'john@example.com',
    });
    expect(Object.keys(result.user)).toEqual(['id', 'email']);
  });
});

