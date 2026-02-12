import { describe, expect, it, vi, beforeEach } from 'vitest';
import { AnonymizeUserUseCase } from './anonymize-user-use-case';
import { IUsersRepository } from '@/repositories/users-repository';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { UsuarioTentandoPegarInformacoesDeOutro } from '../errors/usuario-pegando-informacao-de-outro-usuario-error';
import { User, Role } from '@prisma/client';
import { createMockUsersRepository } from '@/mock/mock-repositories';
import { makeUser } from '@/test/factories';

// Tipo para o mock do repositório
type MockUsersRepository = IUsersRepository & {
  findById: ReturnType<typeof vi.fn>;
  anonymize: ReturnType<typeof vi.fn>;
};

describe('AnonymizeUserUseCase', () => {
  let usersRepository: MockUsersRepository;
  let sut: AnonymizeUserUseCase;

  beforeEach(() => {
    usersRepository = createMockUsersRepository();

    sut = new AnonymizeUserUseCase(usersRepository);
  });

  it('deve anonimizar um usuário com sucesso (ADMIN)', async () => {
    const mockUser: User = makeUser({
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123456789',
      role: Role.CLIENTE,
    });

    usersRepository.findById.mockResolvedValue(mockUser);
    usersRepository.anonymize.mockResolvedValue(undefined);

    await sut.execute({
      userIdToAnonymize: 'user-1',
      userId: 'admin-1',
      role: Role.ADMIN,
    });

    expect(usersRepository.findById).toHaveBeenCalledWith('user-1');
    expect(usersRepository.anonymize).toHaveBeenCalledWith('user-1');
  });

  it('deve anonimizar o próprio usuário (CLIENTE)', async () => {
    const mockUser: User = makeUser({
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123456789',
      role: Role.CLIENTE,
    });

    usersRepository.findById.mockResolvedValue(mockUser);
    usersRepository.anonymize.mockResolvedValue(undefined);

    await sut.execute({
      userIdToAnonymize: 'user-1',
      userId: 'user-1',
      role: Role.CLIENTE,
    });

    expect(usersRepository.findById).toHaveBeenCalledWith('user-1');
    expect(usersRepository.anonymize).toHaveBeenCalledWith('user-1');
  });

  it('deve lançar erro quando o usuário não existe', async () => {
    usersRepository.findById.mockResolvedValue(null);

    await expect(
      sut.execute({
        userIdToAnonymize: 'non-existent-user',
        userId: 'admin-1',
        role: Role.ADMIN,
      }),
    ).rejects.toThrow(UserNotFoundError);

    expect(usersRepository.anonymize).not.toHaveBeenCalled();
  });

  it('deve lançar erro quando CLIENTE tenta anonimizar outro usuário', async () => {
    const mockUser: User = makeUser({
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123456789',
      role: Role.CLIENTE,
    });

    usersRepository.findById.mockResolvedValue(mockUser);
    usersRepository.anonymize.mockResolvedValue(undefined);

    await expect(
      sut.execute({
        userIdToAnonymize: 'user-1',
        userId: 'another-user',
        role: 'CLIENTE',
      }),
    ).rejects.toThrow(UsuarioTentandoPegarInformacoesDeOutro);

    expect(usersRepository.anonymize).not.toHaveBeenCalled();
  });

  it('deve permitir PROFISSIONAL anonimizar outro usuário', async () => {
    const mockUser: User = makeUser({
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123456789',
      role: Role.CLIENTE,
    });

    usersRepository.findById.mockResolvedValue(mockUser);
    usersRepository.anonymize.mockResolvedValue(undefined);

    await sut.execute({
      userIdToAnonymize: 'user-1',
      userId: 'professional-1',
      role: Role.PROFISSIONAL,
    });

    expect(usersRepository.findById).toHaveBeenCalledWith('user-1');
    expect(usersRepository.anonymize).toHaveBeenCalledWith('user-1');
  });

  it('deve lançar erro quando userIdToAnonymize não é fornecido', async () => {
    await expect(
      sut.execute({
        userIdToAnonymize: '',
        userId: 'admin-1',
        role: Role.ADMIN,
      }),
    ).rejects.toThrow(UserNotFoundError);
  });
});
