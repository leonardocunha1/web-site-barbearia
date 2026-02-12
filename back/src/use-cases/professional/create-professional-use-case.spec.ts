import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateProfessionalUseCase } from './create-professional-use-case';
import { IProfessionalsRepository } from '@/repositories/professionals-repository';
import { IUsersRepository } from '@/repositories/users-repository';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { UserAlreadyProfessionalError } from '../errors/user-already-professional-error';
import {
  createMockProfessionalsRepository,
  createMockUsersRepository,
} from '@/mock/mock-repositories';
import { makeProfessional, makeUser } from '@/test/factories';

type MockProfessionalsRepository = IProfessionalsRepository & {
  findByUserId: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
};

type MockUsersRepository = IUsersRepository & {
  findByEmail: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
};

describe('Create Professional Use Case', () => {
  let useCase: CreateProfessionalUseCase;
  let mockProfessionalsRepository: MockProfessionalsRepository;
  let mockUsersRepository: MockUsersRepository;

  beforeEach(() => {
    mockProfessionalsRepository = createMockProfessionalsRepository();
    mockUsersRepository = createMockUsersRepository();

    useCase = new CreateProfessionalUseCase(mockProfessionalsRepository, mockUsersRepository);
  });

  const mockUser = makeUser({
    id: 'user-123',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'CLIENT' as any,
    active: true,
  });

  const mockProfessional = makeProfessional({
    id: 'prof-123',
    userId: 'user-123',
    specialty: 'Dentista',
    bio: 'Especialista em odontologia',
    document: '123456',
    active: true,
  });

  it('deve criar um profissional com sucesso', async () => {
    mockUsersRepository.findByEmail.mockResolvedValue(mockUser);
    mockProfessionalsRepository.findByUserId.mockResolvedValue(null);
    mockUsersRepository.update.mockResolvedValue({
      ...mockUser,
      role: 'PROFESSIONAL',
    });
    mockProfessionalsRepository.create.mockResolvedValue(mockProfessional);

    const result = await useCase.execute({
      email: 'john@example.com',
      specialty: 'Dentista',
      bio: 'Especialista em odontologia',
      document: '123456',
    });

    expect(result).toEqual(mockProfessional);
    expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
    expect(mockProfessionalsRepository.findByUserId).toHaveBeenCalledWith('user-123');
    expect(mockUsersRepository.update).toHaveBeenCalledWith('user-123', {
      role: 'PROFESSIONAL',
    });
    expect(mockProfessionalsRepository.create).toHaveBeenCalledWith({
      specialty: 'Dentista',
      bio: 'Especialista em odontologia',
      active: true,
      avatarUrl: undefined,
      document: '123456',
      user: { connect: { id: 'user-123' } },
    });
  });

  it('deve lançar erro quando usuário não existe', async () => {
    mockUsersRepository.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({
        email: 'nonexistent@example.com',
        specialty: 'Dentista',
      }),
    ).rejects.toThrow(UserNotFoundError);
  });

  it('deve lançar erro quando usuário já é profissional', async () => {
    mockUsersRepository.findByEmail.mockResolvedValue(mockUser);
    mockProfessionalsRepository.findByUserId.mockResolvedValue(mockProfessional);

    await expect(
      useCase.execute({
        email: 'john@example.com',
        specialty: 'Dentista',
      }),
    ).rejects.toThrow(UserAlreadyProfessionalError);
  });

  it('deve criar profissional com dados mínimos', async () => {
    mockUsersRepository.findByEmail.mockResolvedValue(mockUser);
    mockProfessionalsRepository.findByUserId.mockResolvedValue(null);
    mockUsersRepository.update.mockResolvedValue({
      ...mockUser,
      role: 'PROFESSIONAL',
    });
    mockProfessionalsRepository.create.mockResolvedValue({
      ...mockProfessional,
      bio: null,
      document: null,
    });

    const result = await useCase.execute({
      email: 'john@example.com',
      specialty: 'Dentista',
    });

    expect(result).toEqual({
      ...mockProfessional,
      bio: null,
      document: null,
    });
    expect(mockProfessionalsRepository.create).toHaveBeenCalledWith({
      specialty: 'Dentista',
      bio: undefined,
      document: undefined,
      active: true,
      avatarUrl: undefined,
      user: { connect: { id: 'user-123' } },
    });
  });

  it('deve atualizar role do usuário para PROFISSIONAL', async () => {
    mockUsersRepository.findByEmail.mockResolvedValue(mockUser);
    mockProfessionalsRepository.findByUserId.mockResolvedValue(null);
    mockUsersRepository.update.mockResolvedValue({
      ...mockUser,
      role: 'PROFESSIONAL',
    });
    mockProfessionalsRepository.create.mockResolvedValue(mockProfessional);

    await useCase.execute({
      email: 'john@example.com',
      specialty: 'Dentista',
    });

    expect(mockUsersRepository.update).toHaveBeenCalledWith('user-123', {
      role: 'PROFESSIONAL',
    });
  });

  it('não deve chamar create se validações falharem', async () => {
    mockUsersRepository.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({
        email: 'john@example.com',
        specialty: 'Dentista',
      }),
    ).rejects.toThrow();

    expect(mockProfessionalsRepository.create).not.toHaveBeenCalled();
  });
});
