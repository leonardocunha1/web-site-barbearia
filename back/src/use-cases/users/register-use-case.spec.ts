import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserAlreadyExistsError } from '../errors/user-already-exists-error';
import { InsufficientPermissionsError } from '../errors/insufficient-permissions-error';
import { IUsersRepository } from '@/repositories/users-repository';
import { createMockUsersRepository } from '@/mock/mock-repositories';
import { makeUser } from '@/test/factories';

import bcrypt from 'bcryptjs';
import { RegisterUserUseCase } from './register-use-case';

// Mock do bcryptjs antes do import
vi.mock('bcryptjs', () => {
  return {
    default: {
      hash: vi.fn(),
    },
  };
}); // Import após vi.mock
const bcryptHash = bcrypt.hash as ReturnType<typeof vi.fn>;

type MockUsersRepository = IUsersRepository & {
  findByEmail: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
};

describe('Register User Use Case', () => {
  let useCase: RegisterUserUseCase;
  let mockUsersRepository: MockUsersRepository;
  let sendVerificationEmail: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockUsersRepository = {
      ...createMockUsersRepository(),
      findByEmail: vi.fn(),
      create: vi.fn(),
    };

    sendVerificationEmail = vi.fn();

    useCase = new RegisterUserUseCase({
      usersRepository: mockUsersRepository,
      sendVerificationEmail,
    });
  });

  const userInput = {
    name: 'Alice',
    email: 'alice@example.com',
    password: 'secure-password',
    phone: '(11) 99999-9999',
  };

  it('deve registrar um usuário com sucesso', async () => {
    mockUsersRepository.findByEmail.mockResolvedValue(null);
    bcryptHash.mockResolvedValue('hashed-password');
    mockUsersRepository.create.mockResolvedValue(
      makeUser({
        id: 'user-1',
        name: userInput.name,
        email: userInput.email,
        password: 'hashed-password',
        phone: userInput.phone,
        role: 'CLIENT' as any,
      }),
    );

    await useCase.execute(userInput);

    expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith('alice@example.com');
    expect(bcryptHash).toHaveBeenCalledWith('secure-password', 6);
    expect(mockUsersRepository.create).toHaveBeenCalledWith({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'hashed-password',
      phone: '(11) 99999-9999',
      role: 'CLIENT',
    });
    expect(sendVerificationEmail).toHaveBeenCalledWith('alice@example.com');
  });

  it('não deve permitir registro se o e-mail já estiver em uso', async () => {
    mockUsersRepository.findByEmail.mockResolvedValue({ id: 'existing-id' });

    await expect(useCase.execute(userInput)).rejects.toThrow(UserAlreadyExistsError);
    expect(mockUsersRepository.create).not.toHaveBeenCalled();
    expect(sendVerificationEmail).not.toHaveBeenCalled();
  });

  it('não deve permitir criação de ADMIN por usuários não admins', async () => {
    await expect(
      useCase.execute({
        ...userInput,
        role: 'ADMIN',
        requestRole: 'CLIENT', // ou undefined
      }),
    ).rejects.toThrow(InsufficientPermissionsError);

    expect(mockUsersRepository.findByEmail).not.toHaveBeenCalled();
    expect(sendVerificationEmail).not.toHaveBeenCalled();
  });

  it('deve permitir criação de ADMIN se o requestRole for ADMIN', async () => {
    mockUsersRepository.findByEmail.mockResolvedValue(null);
    bcryptHash.mockResolvedValue('hashed-password');
    mockUsersRepository.create.mockResolvedValue(
      makeUser({
        id: 'admin-1',
        name: userInput.name,
        email: userInput.email,
        password: 'hashed-password',
        phone: userInput.phone,
        role: 'ADMIN' as any,
      }),
    );

    await useCase.execute({
      ...userInput,
      role: 'ADMIN',
      requestRole: 'ADMIN',
    });

    expect(mockUsersRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ role: 'ADMIN' }),
    );
    expect(sendVerificationEmail).toHaveBeenCalledWith('alice@example.com');
  });
});
