import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateUserProfileUseCase } from './update-user-profile-use-case';
import { IUsersRepository } from '@/repositories/users-repository';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { InvalidDataError } from '../errors/invalid-data-error';
import { EmailAlreadyExistsError } from '../errors/user-email-already-exists-error';
import { createMockUsersRepository } from '@/mock/mock-repositories';

type MockUsersRepository = IUsersRepository & {
  findById: ReturnType<typeof vi.fn>;
  findByEmail: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
};

describe('Update User Profile Use Case', () => {
  let useCase: UpdateUserProfileUseCase;
  let mockUsersRepository: MockUsersRepository;

  beforeEach(() => {
    mockUsersRepository = createMockUsersRepository();
    useCase = new UpdateUserProfileUseCase(mockUsersRepository);
  });

  const mockUser = {
    id: 'user-123', name: 'John Doe',
    email: 'john@example.com',
    telefone: '123456789',
    role: 'CLIENT',
    active: true,
  };

  it('deve atualizar o perfil do usuário com sucesso', async () => {
    // Configurar mocks
    mockUsersRepository.findById.mockResolvedValue(mockUser);
    mockUsersRepository.update.mockResolvedValue({
      ...mockUser, name: 'John Updated',
    });

    // Executar
    const result = await useCase.execute({
      userId: 'user-123', name: 'John Updated',
    });

    // Verificar
    expect(result.user.name).toBe('John Updated');
    expect(mockUsersRepository.findById).toHaveBeenCalledWith('user-123');
    expect(mockUsersRepository.update).toHaveBeenCalledWith('user-123', { name: 'John Updated',
    });
  });

  it('deve lançar erro quando usuário não existe', async () => {
    // Configurar mocks
    mockUsersRepository.findById.mockResolvedValue(null);

    // Executar e verificar
    await expect(
      useCase.execute({
        userId: 'non-existent-user', name: 'John Updated',
      }),
    ).rejects.toThrow(UserNotFoundError);
  });

  it('deve lançar erro quando email já está em uso por outro usuário', async () => {
    // Configurar mocks
    mockUsersRepository.findById.mockResolvedValue(mockUser);
    mockUsersRepository.findByEmail.mockResolvedValue({
      ...mockUser,
      id: 'other-user-456',
    });

    // Executar e verificar
    await expect(
      useCase.execute({
        userId: 'user-123',
        email: 'existing@example.com',
      }),
    ).rejects.toThrow(EmailAlreadyExistsError);
  });

  it('deve lançar erro quando email fornecido é o mesmo que o atual', async () => {
    // Configurar mocks
    mockUsersRepository.findById.mockResolvedValue(mockUser);

    // Executar e verificar
    await expect(
      useCase.execute({
        userId: 'user-123',
        email: 'john@example.com', // mesmo email atual
      }),
    ).rejects.toThrow(InvalidDataError);
  });

  it('deve atualizar apenas o telefone quando fornecido', async () => {
    // Configurar mocks
    mockUsersRepository.findById.mockResolvedValue(mockUser);
    mockUsersRepository.update.mockResolvedValue({
      ...mockUser,
      telefone: '987654321',
    });

    // Executar
    const result = await useCase.execute({
      userId: 'user-123',
      telefone: '987654321',
    });

    // Verificar
    expect(result.user.phone).toBe('987654321');
    expect(mockUsersRepository.update).toHaveBeenCalledWith('user-123', {
      telefone: '987654321',
    });
  });

  it('deve atualizar múltiplos campos simultaneamente', async () => {
    // Configurar mocks
    mockUsersRepository.findById.mockResolvedValue(mockUser);
    mockUsersRepository.findByEmail.mockResolvedValue(null);
    mockUsersRepository.update.mockResolvedValue({
      ...mockUser, name: 'John Updated',
      email: 'updated@example.com',
      telefone: '987654321',
    });

    // Executar
    const result = await useCase.execute({
      userId: 'user-123', name: 'John Updated',
      email: 'updated@example.com',
      telefone: '987654321',
    });

    // Verificar
    expect(result.user.name).toBe('John Updated');
    expect(result.user.email).toBe('updated@example.com');
    expect(result.user.phone).toBe('987654321');
    expect(mockUsersRepository.update).toHaveBeenCalledWith('user-123', { name: 'John Updated',
      email: 'updated@example.com',
      telefone: '987654321',
    });
  });

  it('não deve chamar update se nenhum campo for fornecido', async () => {
    // Configurar mocks
    mockUsersRepository.findById.mockResolvedValue(mockUser);

    // Executar
    const result = await useCase.execute({
      userId: 'user-123',
    });

    // Verificar
    expect(result.user).toEqual(mockUser);
    expect(mockUsersRepository.update).not.toHaveBeenCalled();
  });

  it('deve permitir atualizar para telefone null', async () => {
    // Configurar mocks
    mockUsersRepository.findById.mockResolvedValue(mockUser);
    mockUsersRepository.update.mockResolvedValue({
      ...mockUser,
      telefone: null,
    });

    // Executar
    const result = await useCase.execute({
      userId: 'user-123',
      telefone: null,
    });

    // Verificar
    expect(result.user.phone).toBeNull();
    expect(mockUsersRepository.update).toHaveBeenCalledWith('user-123', {
      telefone: null,
    });
  });
});

