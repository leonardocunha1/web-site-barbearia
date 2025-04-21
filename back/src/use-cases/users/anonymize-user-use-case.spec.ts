import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AnonymizeUserUseCase } from './anonymize-user-use-case';
import { UserNotFoundError } from '../errors/user-not-found-error';

let usersRepository: InMemoryUsersRepository;
let sut: AnonymizeUserUseCase;

describe('Caso de Uso: Anonimizar Usuário', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AnonymizeUserUseCase(usersRepository);
  });

  it('deve anonimizar um usuário existente', async () => {
    // Cria um usuário para teste
    const user = await usersRepository.create({
      nome: 'John Doe',
      email: 'john@example.com',
      senha: '123456',
      telefone: '11999999999',
      role: 'CLIENTE',
    });

    // Executa o caso de uso
    await sut.execute(user.id);

    // Busca o usuário anonimizado
    const anonymizedUser = await usersRepository.findById(user.id);

    // Verificações
    expect(anonymizedUser).toBeDefined();
    expect(anonymizedUser?.email).toMatch(/^anon-\d+@deleted\.com$/);
    expect(anonymizedUser?.telefone).toMatch(/^deleted-[a-z0-9]+$/);
    expect(anonymizedUser?.active).toBe(false);
    expect(anonymizedUser?.senha).not.toBe('123456'); // Senha deve estar hasheada
    expect(anonymizedUser?.updatedAt).toBeInstanceOf(Date);
  });

  it('não deve anonimizar um usuário inexistente', async () => {
    await expect(sut.execute('id-inexistente')).rejects.toBeInstanceOf(
      UserNotFoundError,
    );
  });

  it('deve garantir que os dados anonimizados são únicos', async () => {
    // Cria dois usuários para teste
    const user1 = await usersRepository.create({
      nome: 'User 1',
      email: 'user1@example.com',
      senha: '123456',
      telefone: '11999999991',
    });

    const user2 = await usersRepository.create({
      nome: 'User 2',
      email: 'user2@example.com',
      senha: '123456',
      telefone: '11999999992',
    });

    // Anonimiza ambos os usuários
    await sut.execute(user1.id);
    await sut.execute(user2.id);

    // Busca os usuários anonimizados
    const anonymizedUser1 = await usersRepository.findById(user1.id);
    const anonymizedUser2 = await usersRepository.findById(user2.id);

    // Verifica se os dados anonimizados são diferentes
    expect(anonymizedUser1?.email).not.toBe(anonymizedUser2?.email);
    expect(anonymizedUser1?.telefone).not.toBe(anonymizedUser2?.telefone);
  });

  it('deve manter a senha hasheada após anonimização', async () => {
    const user = await usersRepository.create({
      nome: 'Test User',
      email: 'test@example.com',
      senha: '123456',
    });

    await sut.execute(user.id);
    const anonymizedUser = await usersRepository.findById(user.id);

    // Verifica se a senha foi alterada e está hasheada
    expect(anonymizedUser?.senha).not.toBe('123456');
    expect(anonymizedUser?.senha).not.toBe('deleted-account'); // Deve estar hasheada
    expect(anonymizedUser?.senha.length).toBeGreaterThan(30); // Tamanho típico de hash
  });
});
