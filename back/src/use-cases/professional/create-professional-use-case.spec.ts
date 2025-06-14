import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateProfessionalUseCase } from './create-professional-use-case';
import { ProfessionalsRepository } from '@/repositories/professionals-repository';
import { UsersRepository } from '@/repositories/users-repository';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { UserAlreadyProfessionalError } from '../errors/user-already-professional-error';
import {
  createMockProfessionalsRepository,
  createMockUsersRepository,
} from '@/mock/mock-repositories';

type MockProfessionalsRepository = ProfessionalsRepository & {
  findByUserId: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
};

type MockUsersRepository = UsersRepository & {
  findById: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
};

describe('Create Professional Use Case', () => {
  let useCase: CreateProfessionalUseCase;
  let mockProfessionalsRepository: MockProfessionalsRepository;
  let mockUsersRepository: MockUsersRepository;

  beforeEach(() => {
    mockProfessionalsRepository = createMockProfessionalsRepository();
    mockUsersRepository = createMockUsersRepository();

    useCase = new CreateProfessionalUseCase(
      mockProfessionalsRepository,
      mockUsersRepository,
    );
  });

  const mockUser = {
    id: 'user-123',
    nome: 'John Doe',
    email: 'john@example.com',
    role: 'CLIENTE',
    active: true,
  };

  const mockProfessional = {
    id: 'prof-123',
    userId: 'user-123',
    especialidade: 'Dentista',
    bio: 'Especialista em odontologia',
    documento: '123456',
    ativo: true,
  };

  it('deve criar um profissional com sucesso', async () => {
    // Configurar mocks
    mockUsersRepository.findById.mockResolvedValue(mockUser);
    mockProfessionalsRepository.findByUserId.mockResolvedValue(null);
    mockUsersRepository.update.mockResolvedValue({
      ...mockUser,
      role: 'PROFISSIONAL',
    });
    mockProfessionalsRepository.create.mockResolvedValue(mockProfessional);

    // Executar
    const result = await useCase.execute({
      userId: 'user-123',
      especialidade: 'Dentista',
      bio: 'Especialista em odontologia',
      documento: '123456',
    });

    // Verificar
    expect(result).toEqual(mockProfessional);
    expect(mockUsersRepository.findById).toHaveBeenCalledWith('user-123');
    expect(mockProfessionalsRepository.findByUserId).toHaveBeenCalledWith(
      'user-123',
    );
    expect(mockUsersRepository.update).toHaveBeenCalledWith('user-123', {
      role: 'PROFISSIONAL',
    });
    expect(mockProfessionalsRepository.create).toHaveBeenCalledWith({
      especialidade: 'Dentista',
      bio: 'Especialista em odontologia',
      ativo: true,
      avatarUrl: undefined,
      documento: '123456',
      user: { connect: { id: 'user-123' } },
    });
  });

  it('deve lançar erro quando usuário não existe', async () => {
    // Configurar mocks
    mockUsersRepository.findById.mockResolvedValue(null);

    // Executar e verificar
    await expect(
      useCase.execute({
        userId: 'non-existent-user',
        especialidade: 'Dentista',
      }),
    ).rejects.toThrow(UserNotFoundError);
  });

  it('deve lançar erro quando usuário já é profissional', async () => {
    // Configurar mocks
    mockUsersRepository.findById.mockResolvedValue(mockUser);
    mockProfessionalsRepository.findByUserId.mockResolvedValue(
      mockProfessional,
    );

    // Executar e verificar
    await expect(
      useCase.execute({
        userId: 'user-123',
        especialidade: 'Dentista',
      }),
    ).rejects.toThrow(UserAlreadyProfessionalError);
  });

  it('deve criar profissional com dados mínimos', async () => {
    // Configurar mocks
    mockUsersRepository.findById.mockResolvedValue(mockUser);
    mockProfessionalsRepository.findByUserId.mockResolvedValue(null);
    mockUsersRepository.update.mockResolvedValue({
      ...mockUser,
      role: 'PROFISSIONAL',
    });
    mockProfessionalsRepository.create.mockResolvedValue({
      ...mockProfessional,
      bio: null,
      documento: null,
    });

    // Executar
    const result = await useCase.execute({
      userId: 'user-123',
      especialidade: 'Dentista',
    });

    // Verificar
    expect(result).toEqual({
      ...mockProfessional,
      bio: null,
      documento: null,
    });
    expect(mockProfessionalsRepository.create).toHaveBeenCalledWith({
      especialidade: 'Dentista',
      bio: undefined,
      documento: undefined,
      ativo: true,
      avatarUrl: undefined,
      user: { connect: { id: 'user-123' } },
    });
  });

  it('deve atualizar role do usuário para PROFISSIONAL', async () => {
    // Configurar mocks
    mockUsersRepository.findById.mockResolvedValue(mockUser);
    mockProfessionalsRepository.findByUserId.mockResolvedValue(null);
    mockUsersRepository.update.mockResolvedValue({
      ...mockUser,
      role: 'PROFISSIONAL',
    });
    mockProfessionalsRepository.create.mockResolvedValue(mockProfessional);

    // Executar
    await useCase.execute({
      userId: 'user-123',
      especialidade: 'Dentista',
    });

    // Verificar se a role foi atualizada
    expect(mockUsersRepository.update).toHaveBeenCalledWith('user-123', {
      role: 'PROFISSIONAL',
    });
  });

  it('não deve chamar create se validações falharem', async () => {
    // Configurar mocks para simular usuário não encontrado
    mockUsersRepository.findById.mockResolvedValue(null);

    // Executar e verificar
    await expect(
      useCase.execute({
        userId: 'user-123',
        especialidade: 'Dentista',
      }),
    ).rejects.toThrow();

    // Verificar que create não foi chamado
    expect(mockProfessionalsRepository.create).not.toHaveBeenCalled();
  });
});
